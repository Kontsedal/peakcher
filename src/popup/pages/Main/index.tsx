import React, { useCallback, useContext, useMemo, useState } from "react";
import styles from "./styles.module.scss";
import { ImagesGrid } from "../../components/ImagesGrid";
import { TagsSelect } from "../../components/TagsSelect";
import { useSelector } from "react-redux";
import {
  getFiles,
  getFilesArray,
  getTags,
  getTagsArray,
} from "common/store/selectors";
import { ImageData } from "common/interfaces";
import { I18n } from "../../../common/services/I18n";
import { Button } from "../../components/Button";
import { CurrentViewContext } from "../../context/CurrentView";
import { UploadFilesButton } from "../../components/UploadFilesButton";
import orderBy from "lodash/orderBy";
import { UploadIndicator } from "../../components/UploadIndicator";
import { SORT_OPTIONS, SortSelect } from "../../components/SortSelect";
import { NoFiles } from "./components/NoFiles";

const sortImages = (files: ImageData[], sortType: string): ImageData[] => {
  switch (sortType) {
    case SORT_OPTIONS.NEW_FIRST:
      return orderBy(files, ["createdAt"], ["desc"]);
    case SORT_OPTIONS.OLD_FIRST:
      return orderBy(files, ["createdAt"], ["asc"]);
    case SORT_OPTIONS.POPULAR_FIRST:
      return orderBy(files, ["usedTimes"], ["desc"]);
    case SORT_OPTIONS.UNPOPULAR_FIRST:
      return orderBy(files, ["usedTimes"], ["asc"]);
    case SORT_OPTIONS.WITHOUT_TAGS:
      return files.filter((file) => file.tags.length === 0);
    default:
      return files;
  }
};

export const MainPage = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortType, setSortType] = useState(SORT_OPTIONS.NEW_FIRST);
  const tags = useSelector(getTags);
  const tagsArray = useSelector(getTagsArray);
  let filesArray = useSelector(getFilesArray);
  const files = useSelector(getFiles);
  const { showSettings } = useContext(CurrentViewContext);

  const handleSelectTag = useCallback(
    (tag) => {
      setSelectedTags([...selectedTags, tag]);
    },
    [selectedTags, setSelectedTags]
  );
  const handleRemoveTag = useCallback(
    (tag) => {
      setSelectedTags(selectedTags.filter((item) => item !== tag));
    },
    [selectedTags, setSelectedTags]
  );
  const filteredFiles: ImageData[] = useMemo(() => {
    const result = {};
    selectedTags.forEach((tag) => {
      const tagFiles = tags[tag];
      tagFiles.forEach((fileId) => {
        if (!files[fileId]) {
          return;
        }
        result[fileId] = files[fileId];
      });
    });
    return Object.values(result);
  }, [selectedTags, files]);
  filesArray = useMemo(() => {
    return sortImages(filesArray, sortType);
  }, [filesArray, sortType]);
  const filesToRender = selectedTags.length ? filteredFiles : filesArray;
  const hasFiles = !!filesToRender.length;
  return (
    <div className={styles.root}>
      <UploadIndicator />
      <div className={styles.toolbar}>
        <TagsSelect
          className={styles.tagsSelect}
          options={tagsArray}
          selectedOptions={selectedTags}
          onSelect={handleSelectTag}
          onRemove={handleRemoveTag}
          placeholder={I18n.t("searchBarPlaceholder")}
          optionTextGetter={(tag) => (
            <span>
              <span className={styles.tagBadge}>{tags[tag].length}</span>
              <span>{tag}</span>
            </span>
          )}
        />
        <div className={styles.actions}>
          <UploadFilesButton />
          <Button onClick={() => showSettings(true)}>
            {I18n.t("settingsButtonTitle")}
          </Button>
        </div>
      </div>
      <div className={styles.sortWrapper}>
        <SortSelect onChange={setSortType} value={sortType} />
      </div>
      <div className={styles.gridWrapper}>
        {hasFiles && <ImagesGrid files={filesToRender} />}
        {!hasFiles && <NoFiles />}
      </div>
    </div>
  );
};
