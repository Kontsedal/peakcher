import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { getSearchColumnsCount } from "common/store/selectors";
import { CONFIG } from "config";
import { ImageData } from "common/interfaces";
import * as utils from "./utils";
import styles from "./styles.module.scss";
import { ImageItem } from "./components/ImageItem";

const SCROLL_PERCENT_TO_SHOW_MORE_IMAGES = 99;
const DEFAULT_VISIBLE_ROWS = 6;
const MORE_ROWS_COUNT = 3;

export const ImagesGrid = ({ files }: { files: ImageData[] }) => {
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
            gridWidth,
            imagesOffset: CONFIG.GRID_CELLS_DISTANCE,
            columnsCount,
          })
        : undefined,
    [files, gridWidth, columnsCount]
  );
  const calculateGridWidth = useCallback(() => {
    if (!containerRef.current) {
      return;
    }
    setGridWidth(containerRef.current.clientWidth);
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
    const { scrollTop } = element;
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
              <ImageItem file={file} />
            </div>
          );
        })}
    </div>
  );
};
