
export function showToast(text: string, duration?: "short" | "long" |number, position?: "top"|"center"|"bottom") {
    (window as any).plugins.toast.show(text, duration || "long", position || "bottom");
}
