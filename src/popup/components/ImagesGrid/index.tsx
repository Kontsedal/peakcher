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
import PropTypes from "prop-types";
import * as utils from "./utils";
import styles from "./styles.module.scss";
import { ImageItem } from "./components/ImageItem";

const SCROLL_PERCENT_TO_SHOW_MORE_IMAGES = 99;
const DEFAULT_VISIBLE_ROWS = 6;
const MORE_ROWS_COUNT = 3;

export const ImagesGrid: React.FC<{ files: ImageData[] }> = ({ files }) => {
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
  }, [setGridWidth]);
  const setContainerRef = useCallback(
    (elem) => {
      containerRef.current = elem;
      calculateGridWidth();
    },
    [calculateGridWidth]
  );
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
  }, [visibleImageRows, setVisibleImageRows]);
  useEffect(() => {
    const handler = () => {
      calculateGridWidth();
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [calculateGridWidth]);
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

ImagesGrid.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.exact({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string),
      name: PropTypes.string.isRequired,
      publicUrl: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      size: PropTypes.number.isRequired,
      createdAt: PropTypes.number.isRequired,
      usedTimes: PropTypes.number.isRequired,
    })
  ),
};

ImagesGrid.defaultProps = {
  files: [],
};
