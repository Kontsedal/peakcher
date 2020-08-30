import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Logger } from "common/services/Logger";
import PropTypes from "prop-types";
import { Toast, ToastTypes } from ".";
import styles from "./styles.module.scss";

export const ToastContext = createContext({
  showToast: (params: { text: string; type: ToastTypes; timeout?: number }) => {
    Logger.log("showToast", params);
  },
});

export const ToastProvider: React.FC = ({ children }) => {
  const toastId = useRef(0);
  const timeouts = useRef([]);
  const [toasts, setToasts] = useState<
    { text: string; type: ToastTypes; id: number; onClose: () => void }[]
  >([]);

  const hideToast = useCallback(
    (id) => {
      setToasts((oldToasts) => oldToasts.filter((toast) => toast.id !== id));
    },
    [setToasts]
  );

  const showToast = useCallback(
    ({ text, type, timeout = 2000 }) => {
      toastId.current += 1;
      const id = toastId.current;
      const toast = { text, type, id, onClose: () => hideToast(id) };
      setToasts((oldToasts) => [...oldToasts, toast]);
      const timeoutId = setTimeout(() => {
        hideToast(id);
      }, timeout);
      timeouts.current.push(timeoutId);
    },
    [setToasts, hideToast]
  );

  useEffect(() => () => timeouts.current.forEach(clearTimeout), []);
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <TransitionGroup
        className={styles.toastContainer}
        appear
        enter={false}
        exit
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

ToastProvider.propTypes = {
  children: PropTypes.element,
};

ToastProvider.defaultProps = {
  children: null,
};
