export const useGetStoredToken = () => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  return { token };
};
