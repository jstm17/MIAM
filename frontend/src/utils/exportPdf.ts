import type { Recipe } from "@/types/recipe.types";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

export const exportPdf = async (recipe: Recipe) => {
  const toastId = toast.loading("Génération du PDF...");

  // Création d'une IFrame pour isoler le rendu et éviter les conflits de CSS (comme l'erreur oklch)
  const iframe = document.createElement("iframe");
  iframe.style.visibility = "hidden";
  iframe.style.position = "fixed";
  iframe.style.left = "-9999px";
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow?.document;
  if (!iframeDoc) {
    toast.dismiss(toastId);
    toast.error("Échec de l'initialisation de l'export");
    return;
  }

  const htmlContent = `
  <html>
  <head>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap");
      body {
        font-family: "Inter", sans-serif;
        color: #1a1a1a;
        background: white;
        margin: 0;
      }
      .page {
        width: 794px;
        min-height: 1123px;
        padding: 40px;
        box-sizing: border-box;
      }
      .container {
        width: 100%;
      }
      .header {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        align-items: center;
        margin-bottom: 40px;
      }
      .title {
        font-size: 32px;
        margin: 0 0 8px 0;
        font-weight: 700;
      }
      .metadata {
        color: #64748b;
        font-size: 14px;
        font-weight: 500;
      }
      .recipe-image {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 16px;
        border: 3px solid #f1f5f9;
      }

      .content {
        display: flex;
        flex-direction: column;
        gap: 32px;
      }

      .section-title {
        font-size: 18px;
        font-weight: 700;
        margin: 0 0 20px 0;
        padding-bottom: 8px;
        width: fit-content;
      }

      .sidebar-content {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
      }
      .sidebar .section-title {
        border-bottom: 2px solid #ff751f;
        font-size: 16px;
      }
      .main-content .section-title {
        border-bottom: 2px solid #ff751f;
        font-size: 16px;
      }
      .ingredient-item {
        margin-bottom: 12px;
        list-style: none;
        font-size: 14px;
        display: flex;
        align-items: baseline;
        gap: 10px;
      }
      .bullet {
        color: #ff751f;
        font-weight: bold;
      }

      .step-number {
        font-weight: 600;
        font-size: 14px;
        margin: 0
      }

      .step-text {
        margin: 0;
        font-size: 14px;
        line-height: 1.6;
      }
    </style>
  </head>
  <body>
    <div class="page">
      <div class="container">
        <div class="header">
          <h1 class="title">${recipe.name}</h1>
          <div class="metadata">
            ⏱️ ${recipe.time} min • 👥 ${recipe.personsNumber} personnes
          </div>
        </div>
        <div class="content">
          <div class="sidebar">
            <h2 class="section-title">Ingrédients</h2>
              <div class="sidebar-content">
                ${recipe.ingredients
                  .map(
                    (ing) => `
                <div class="ingredient-item">
                  <span class="bullet">•</span>
                  <span
                    ><strong>${ing.quantity}</strong> ${ing.ingredient.name}</span
                  >
                </div>
                `,
                  )
                  .join("")}
              </div>
            </ul>
          </div>
          <div class="main-content">
            <h2 class="section-title">Préparation</h2>
            <div>
              ${recipe.instructions
                .map(
                  (inst, index) => `
              <div class="instruction-step">
                <p class="step-number">Etape ${index + 1}</p>
                <p class="step-text">${inst.content}</p>
              </div>
              `,
                )
                .join("")}
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>


  `;

  iframeDoc.open();
  iframeDoc.write(htmlContent);
  iframeDoc.close();

  // Attendre que les images et polices chargent
  setTimeout(async () => {
    try {
      const canvas = await html2canvas(iframeDoc.body, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = 210;
      const pdfHeight = 297;

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`MIAM-${recipe.slug}.pdf`);

      toast.dismiss(toastId);
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
      toast.error("Échec de la génération du PDF");
    } finally {
      document.body.removeChild(iframe);
    }
  }, 200);
};
