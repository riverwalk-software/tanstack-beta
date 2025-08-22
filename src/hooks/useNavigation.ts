import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

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

  return { isNavigating, navigate, setIsNavigating };
};

interface Return {
  isNavigating: boolean;
  navigate: ReturnType<typeof useNavigate>;
  setIsNavigating: (isNavigating: boolean) => void;
}
