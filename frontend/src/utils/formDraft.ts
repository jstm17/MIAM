import type { CookingTimeFormData } from "@/schemas/cookingTimeForm.schemas";
import type { RecipeFormData } from "@/schemas/recipeForm.schemas";
import type { RecipeDraft } from "@/types/chat.types";

export type AddTab = "add-recipe" | "add-cooking-time";

type StoredImage = {
  dataUrl: string;
  name: string;
  type: string;
};

type RecipeDraftState = {
  values: RecipeFormData;
  imagePreview?: string;
};

type CookingTimeDraftState = {
  values: CookingTimeFormData;
  imagePreview?: string;
};

const RECIPE_KEY = "recipeFormDraft";
const RECIPE_IMAGE_KEY = "recipeFormImage";
const COOKING_TIME_KEY = "cookingTimeFormDraft";
const COOKING_TIME_IMAGE_KEY = "cookingTimeFormImage";
const TAB_KEY = "addFormTab";

const listeners = new Set<() => void>();
let recipeGeneration = 0;
let cookingTimeGeneration = 0;
let draftFlags = { recipe: false, cookingTime: false };

const refreshDraftFlags = () => {
  draftFlags = {
    recipe: recipeMemory != null,
    cookingTime: cookingTimeMemory != null,
  };
};

const emit = () => {
  refreshDraftFlags();
  listeners.forEach((listener) => listener());
};

const sessionStore = () =>
  localStorage.getItem("token") ? localStorage : sessionStorage;

const readItem = (key: string) => sessionStore().getItem(key);

const writeItem = (key: string, value: string) => {
  const current = sessionStore();
  const other = current === localStorage ? sessionStorage : localStorage;
  other.removeItem(key);
  try {
    current.setItem(key, value);
  } catch {
    // Le quota du navigateur est plein : le brouillon reste en mémoire.
  }
};

const removeItem = (key: string) => {
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
};

const blank = (value?: string | null) => !value?.trim();

const asNumber = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;

const asText = (value: unknown) => (typeof value === "string" ? value : "");

const isStoredImage = (value: unknown): value is StoredImage => {
  if (!value || typeof value !== "object") return false;
  const image = value as StoredImage;
  return (
    typeof image.dataUrl === "string" &&
    /^data:image\/(jpeg|png|webp);base64,/.test(image.dataUrl) &&
    typeof image.name === "string" &&
    typeof image.type === "string"
  );
};

const readImage = (key: string) => {
  try {
    const parsed = JSON.parse(readItem(key) || "null");
    return isStoredImage(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
};

const fileFromStoredImage = (image?: StoredImage) => {
  if (!image) return undefined;
  const base64 = image.dataUrl.split(",")[1] || "";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new File([bytes], image.name, { type: image.type });
};

const fileToStoredImage = (file: Blob) =>
  new Promise<StoredImage>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        dataUrl: String(reader.result),
        name: "name" in file && typeof file.name === "string" ? file.name : "photo.jpg",
        type: file.type || "image/jpeg",
      });
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const cloneRecipe = (values: RecipeFormData): RecipeFormData => ({
  name: values.name ?? "",
  timePrep: asNumber(values.timePrep),
  timeCook: asNumber(values.timeCook),
  personsNumber: asNumber(values.personsNumber),
  categories: [...(values.categories ?? [])],
  ingredients: (values.ingredients ?? []).map((item) => ({
    ingredient: item.ingredient ?? "",
    quantity: item.quantity ?? "",
  })),
  instructions: (values.instructions ?? []).map((item) => ({
    content: item.content ?? "",
  })),
  visible: values.visible !== false,
  image: values.image,
});

const cloneCookingTime = (values: CookingTimeFormData): CookingTimeFormData => ({
  name: values.name ?? "",
  device: values.device || undefined,
  degreeCook: asNumber(values.degreeCook),
  timeCook: asNumber(values.timeCook),
  methodCook: values.methodCook ?? "",
  notes: values.notes ?? "",
  categories: [...(values.categories ?? [])],
  visible: values.visible !== false,
  image: values.image,
});

const recipeIsEmpty = (values: RecipeFormData) => {
  const ingredients = values.ingredients ?? [];
  const instructions = values.instructions ?? [];
  return (
    blank(values.name) &&
    values.timePrep == null &&
    values.timeCook == null &&
    values.personsNumber == null &&
    (values.categories ?? []).length === 0 &&
    ingredients.length <= 1 &&
    ingredients.every((item) => blank(item.ingredient) && blank(item.quantity)) &&
    instructions.length <= 1 &&
    instructions.every((item) => blank(item.content)) &&
    !values.image &&
    values.visible !== false
  );
};

const cookingTimeIsEmpty = (values: CookingTimeFormData) =>
  blank(values.name) &&
  blank(values.device) &&
  values.degreeCook == null &&
  values.timeCook == null &&
  blank(values.methodCook) &&
  blank(values.notes) &&
  (values.categories ?? []).length === 0 &&
  !values.image &&
  values.visible !== false;

const readJson = (key: string) => {
  try {
    return JSON.parse(readItem(key) || "null");
  } catch {
    return null;
  }
};

const recipeFromStorage = (): RecipeDraftState | null => {
  const raw = readJson(RECIPE_KEY);
  if (!raw || typeof raw !== "object") return null;
  const image = readImage(RECIPE_IMAGE_KEY);
  const values = cloneRecipe({
    ...(raw as RecipeFormData),
    image: fileFromStoredImage(image),
  });
  if (recipeIsEmpty(values)) return null;
  return { values, imagePreview: image?.dataUrl };
};

const cookingTimeFromStorage = (): CookingTimeDraftState | null => {
  const raw = readJson(COOKING_TIME_KEY);
  if (!raw || typeof raw !== "object") return null;
  const image = readImage(COOKING_TIME_IMAGE_KEY);
  const values = cloneCookingTime({
    ...(raw as CookingTimeFormData),
    image: fileFromStoredImage(image),
  });
  if (cookingTimeIsEmpty(values)) return null;
  return { values, imagePreview: image?.dataUrl };
};

let recipeMemory = recipeFromStorage();
let cookingTimeMemory = cookingTimeFromStorage();
let recipeImageToken = 0;
let cookingTimeImageToken = 0;
let recipeImageBlob: Blob | null = recipeMemory?.values.image ?? null;
let cookingTimeImageBlob: Blob | null = cookingTimeMemory?.values.image ?? null;
refreshDraftFlags();

const writeRecipeText = (values: RecipeFormData) => {
  const { image: _image, ...text } = values;
  writeItem(RECIPE_KEY, JSON.stringify(text));
};

const writeCookingTimeText = (values: CookingTimeFormData) => {
  const { image: _image, ...text } = values;
  writeItem(COOKING_TIME_KEY, JSON.stringify(text));
};

const storeImage = async (
  file: Blob,
  token: number,
  current: () => number,
  key: string,
  apply: (image: StoredImage) => void,
) => {
  try {
    const image = await fileToStoredImage(file);
    if (token !== current()) return;
    writeItem(key, JSON.stringify(image));
    apply(image);
  } catch {
    // La photo reste disponible tant que la page n'est pas rechargée.
  }
};

export const getRecipeDraftGeneration = () => recipeGeneration;

export const getCookingTimeDraftGeneration = () => cookingTimeGeneration;

export const subscribeFormDrafts = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getFormDraftFlags = () => draftFlags;

export const readRecipeFormDraft = () =>
  recipeMemory
    ? {
        imagePreview: recipeMemory.imagePreview,
        values: cloneRecipe(recipeMemory.values),
      }
    : null;

export const readCookingTimeFormDraft = () =>
  cookingTimeMemory
    ? {
        imagePreview: cookingTimeMemory.imagePreview,
        values: cloneCookingTime(cookingTimeMemory.values),
      }
    : null;

const wipeRecipeDraft = () => {
  recipeImageToken += 1;
  recipeImageBlob = null;
  recipeMemory = null;
  removeItem(RECIPE_KEY);
  removeItem(RECIPE_IMAGE_KEY);
  emit();
};

const wipeCookingTimeDraft = () => {
  cookingTimeImageToken += 1;
  cookingTimeImageBlob = null;
  cookingTimeMemory = null;
  removeItem(COOKING_TIME_KEY);
  removeItem(COOKING_TIME_IMAGE_KEY);
  emit();
};

export const clearRecipeFormDraft = () => {
  recipeGeneration += 1;
  wipeRecipeDraft();
};

export const clearCookingTimeFormDraft = () => {
  cookingTimeGeneration += 1;
  wipeCookingTimeDraft();
};

export const clearFormDrafts = () => {
  clearRecipeFormDraft();
  clearCookingTimeFormDraft();
  removeItem(TAB_KEY);
};

export const saveRecipeFormDraft = (values: RecipeFormData) => {
  const next = cloneRecipe(values);
  if (recipeIsEmpty(next)) {
    if (recipeMemory) wipeRecipeDraft();
    return;
  }

  const image = next.image instanceof Blob ? next.image : undefined;
  next.image = image;
  if (image && image === recipeImageBlob && recipeMemory?.values.image) {
    next.image = recipeMemory.values.image;
  }

  const preview =
    image && image !== recipeImageBlob
      ? URL.createObjectURL(image)
      : image
        ? recipeMemory?.imagePreview
        : undefined;
  recipeMemory = { values: next, imagePreview: preview };
  writeRecipeText(next);
  emit();

  if (!image) {
    recipeImageToken += 1;
    recipeImageBlob = null;
    removeItem(RECIPE_IMAGE_KEY);
    return;
  }

  if (image === recipeImageBlob) return;

  recipeImageBlob = image;
  recipeImageToken += 1;
  const token = recipeImageToken;
  void storeImage(image, token, () => recipeImageToken, RECIPE_IMAGE_KEY, (stored) => {
    if (!recipeMemory) return;
    recipeMemory = { ...recipeMemory, imagePreview: stored.dataUrl };
    emit();
  });
};

export const saveCookingTimeFormDraft = (values: CookingTimeFormData) => {
  const next = cloneCookingTime(values);
  if (cookingTimeIsEmpty(next)) {
    if (cookingTimeMemory) wipeCookingTimeDraft();
    return;
  }

  const image = next.image instanceof Blob ? next.image : undefined;
  next.image = image;
  if (image && image === cookingTimeImageBlob && cookingTimeMemory?.values.image) {
    next.image = cookingTimeMemory.values.image;
  }

  const preview =
    image && image !== cookingTimeImageBlob
      ? URL.createObjectURL(image)
      : image
        ? cookingTimeMemory?.imagePreview
        : undefined;
  cookingTimeMemory = { values: next, imagePreview: preview };
  writeCookingTimeText(next);
  emit();

  if (!image) {
    cookingTimeImageToken += 1;
    cookingTimeImageBlob = null;
    removeItem(COOKING_TIME_IMAGE_KEY);
    return;
  }

  if (image === cookingTimeImageBlob) return;

  cookingTimeImageBlob = image;
  cookingTimeImageToken += 1;
  const token = cookingTimeImageToken;
  void storeImage(
    image,
    token,
    () => cookingTimeImageToken,
    COOKING_TIME_IMAGE_KEY,
    (stored) => {
      if (!cookingTimeMemory) return;
      cookingTimeMemory = { ...cookingTimeMemory, imagePreview: stored.dataUrl };
      emit();
    },
  );
};

export const replaceRecipeFormDraft = (draft: RecipeDraft) => {
  saveRecipeFormDraft({
    name: draft.name,
    timePrep: asNumber(draft.timePrep),
    timeCook: asNumber(draft.timeCook),
    personsNumber: asNumber(draft.personsNumber),
    categories: draft.categories ?? [],
    ingredients: draft.ingredients?.length
      ? draft.ingredients.map((item) => ({
          ingredient: asText(item.ingredient),
          quantity: asText(item.quantity),
        }))
      : [{ ingredient: "", quantity: "" }],
    instructions: draft.instructions?.length
      ? draft.instructions.map((item) => ({ content: asText(item.content) }))
      : [{ content: "" }],
    visible: true,
  });
  saveAddTab("add-recipe");
};

export const readAddTab = (): AddTab =>
  readItem(TAB_KEY) === "add-cooking-time" ? "add-cooking-time" : "add-recipe";

export const saveAddTab = (tab: AddTab) => {
  writeItem(TAB_KEY, tab);
};
