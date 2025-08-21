import { useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";

export const useNavigation = (): Return => {
  const [isNavigating, setIsNavigating] = useState(false);
  // const routerPending = useRouterState({
  //   select: ({ isLoading, isTransitioning, status }) =>
  //     isLoading || isTransitioning || status === "pending",
  // });
  // const isNavigating = useMemo(
  //   () => _isNavigating || routerPending,
  //   [_isNavigating, routerPending],
  // );
  const navigate = useNavigate();
  const toggleIsNavigating = useCallback(
    () => setIsNavigating((prev) => !prev),
    [],
  );

  return { isNavigating, navigate, toggleIsNavigating };
};

interface Return {
  isNavigating: boolean;
  navigate: ReturnType<typeof useNavigate>;
  toggleIsNavigating: () => void;
}
