import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./styles.module.scss";
import { useSelector } from "react-redux";
import { getFilesArray, getSearchColumnsCount } from "common/store/selectors";
import * as utils from "./utils";
import { CONFIG } from "config";
import { File } from "common/interfaces";

const SCROLL_PERCENT_TO_SHOW_MORE_IMAGES = 99;
const DEFAULT_VISIBLE_ROWS = 6;
const MORE_ROWS_COUNT = 3;

export const ImagesGrid = ({ files }: { files: File[] }) => {
  const containerRef = useRef<HTMLDivElement>();
  const [gridWidth, setGridWidth] = useState(0);
  const [visibleImageRows, setVisibleImageRows] = useState(
    DEFAULT_VISIBLE_ROWS
  );
  const columnsCount = useSelector(getSearchColumnsCount);
  const filesPositions = useMemo(
    () =>
      gridWidth
        ? utils.getImagesPositions({
            images: files,
            gridWidth: gridWidth,
            imagesOffset: CONFIG.GRID_CELLS_DISTANCE,
            columnsCount: columnsCount,
          })
        : undefined,
    [files, gridWidth]
  );
  const calculateGridWidth = useCallback(() => {
    if (!containerRef.current) {
      return;
    }
    setGridWidth(containerRef.current.offsetWidth);
  }, [containerRef.current]);
  const setContainerRef = useCallback((elem) => {
    containerRef.current = elem;
    calculateGridWidth();
  }, []);
  const visibleImages = useMemo(
    () => files.slice(0, visibleImageRows * columnsCount),
    [visibleImageRows, columnsCount, files]
  );
  const handleScroll = useCallback(() => {
    const element = containerRef.current;
    const height = element.clientHeight;
    const scrollHeight = element.scrollHeight - height;
    const scrollTop = element.scrollTop;
    const percent = Math.floor((scrollTop / scrollHeight) * 100);
    if (percent >= SCROLL_PERCENT_TO_SHOW_MORE_IMAGES) {
      setVisibleImageRows(visibleImageRows + MORE_ROWS_COUNT);
    }
  }, [containerRef.current, visibleImageRows, setVisibleImageRows]);
  useEffect(() => {
    const handler = () => {
      calculateGridWidth();
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return (
    <div className={styles.root} ref={setContainerRef} onScroll={handleScroll}>
      {filesPositions &&
        visibleImages.map((file) => {
          const { x, y, width, height } = filesPositions[file.id];
          return (
            <div
              key={file.id}
              style={{ width, height, left: x, top: y }}
              className={styles.item}
            >
              <img src={file.publicUrl} />
            </div>
          );
        })}
    </div>
  );
};
