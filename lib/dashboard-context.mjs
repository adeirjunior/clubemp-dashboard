export function getActiveDashboardContext(contexts, activeKey) {
  const list = Array.isArray(contexts) ? contexts.filter(Boolean) : [];
  if (list.length === 0) {
    return null;
  }

  const normalizedKey = typeof activeKey === "string" ? activeKey.trim() : "";
  if (normalizedKey !== "") {
    const matched = list.find(
      (context) => (context?.key || "").trim() === normalizedKey,
    );
    if (matched) {
      return matched;
    }
  }

  return list[0] || null;
}

export function getDashboardContextPath(context) {
  const path = typeof context?.path === "string" ? context.path.trim() : "";
  return path !== "" ? path : "/login";
}

export function getDashboardContextLabel(context, fallback = "Modo atual") {
  const label = typeof context?.label === "string" ? context.label.trim() : "";
  return label !== "" ? label : fallback;
}
