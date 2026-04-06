import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ROLE_DEFINITIONS } from "@/types/roles";
import type { CorporateRole, PermissionCategory } from "@/types/roles";

export function usePermissions() {
  const { user } = useAuth();
  const role: CorporateRole = user?.role ?? "viewer";

  const roleDef = useMemo(
    () => ROLE_DEFINITIONS.find((r) => r.id === role) ?? ROLE_DEFINITIONS[3],
    [role]
  );

  /** Check if a specific action is allowed */
  const can = useMemo(() => {
    const map = new Map<string, boolean>();
    for (const perm of roleDef.permissions) {
      for (const action of perm.actions) {
        map.set(action.id, action.allowed);
      }
    }
    return (actionId: string) => map.get(actionId) ?? false;
  }, [roleDef]);

  /** Check if any action in a category is allowed */
  const canAccessCategory = useMemo(() => {
    const map = new Map<PermissionCategory, boolean>();
    for (const perm of roleDef.permissions) {
      map.set(perm.category, perm.actions.some((a) => a.allowed));
    }
    return (category: PermissionCategory) => map.get(category) ?? false;
  }, [roleDef]);

  return { role, roleDef, can, canAccessCategory };
}
