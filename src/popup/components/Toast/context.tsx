import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Toast, TOAST_TYPES } from "./";
import styles from "./styles.module.scss";
import { CSSTransition, TransitionGroup } from "react-transition-group";

export const ToastContext = createContext({
  showToast: (params: {
    text: string;
    type: TOAST_TYPES;
    timeout?: number;
  }) => {
    console.log("showToast", params);
  },
});

export const ToastProvider = ({ children }) => {
  const toastId = useRef(0);
  const timeouts = useRef([]);
  const [toasts, setToasts] = useState<
    { text: string; type: TOAST_TYPES; id: number; onClose: () => void }[]
  >([]);

  const hideToast = useCallback(
    (id) => {
      setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
    },
    [setToasts]
  );

  const showToast = useCallback(
    ({ text, type, timeout = 2000 }) => {
      toastId.current += 1;
      const id = toastId.current;
      const toast = { text, type, id, onClose: () => hideToast(id) };
      setToasts((toasts) => [...toasts, toast]);
      const timeoutId = setTimeout(() => {
        hideToast(id);
      }, timeout);
      timeouts.current.push(timeoutId);
    },
    [setToasts, toasts]
  );

  useEffect(() => () => timeouts.current.forEach(clearTimeout), []);
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <TransitionGroup
        className={styles.toastContainer}
        appear={true}
        enter={false}
        exit={true}
      >
        {toasts.map((toast) => (
          <CSSTransition
            key={toast.id}
            timeout={300}
            classNames={{
              exit: styles.exit,
              exitActive: styles.exitActive,
            }}
          >
            <Toast
              key={toast.id}
              type={toast.type}
              text={toast.text}
              onClose={toast.onClose}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </ToastContext.Provider>
  );
};
