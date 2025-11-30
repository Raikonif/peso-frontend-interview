export const colorCategory = (
  category: string
): "info" | "warning" | "success" | "danger" | "default" => {
  switch (category) {
    case "electronics":
      return "info";
    case "jewelery":
      return "warning";
    case "men's clothing":
      return "success";
    case "women's clothing":
      return "danger";
    default:
      return "default";
  }
};
