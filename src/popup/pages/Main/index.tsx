import React, { useCallback, useContext, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  getFiles,
  getFilesArray,
  getTags,
  getTagsArray,
} from "common/store/selectors";
import { ImageData } from "common/interfaces";
import orderBy from "lodash/orderBy";
import {
  ImagesGrid,
  TagsSelect,
  Button,
  UploadFilesButton,
  UploadIndicator,
  SortOptions,
  SortSelect,
} from "popup/components";
import { I18n } from "common/services/I18n";
import { CurrentViewContext } from "popup/context/currentView";
import styles from "./styles.module.scss";
import { NoFiles } from "./components/NoFiles";

export const MainPage: React.FC = () => {
  const { showSettings } = useContext(CurrentViewContext);
  const [sortType, setSortType] = useState<SortOptions>(SortOptions.NEW_FIRST);
  const {
    selectedTags,
    tags,
    tagsArray,
    handleSelectTag,
    handleRemoveTag,
  } = useTags();

  const files = useImages({ selectedTags, tags, sortType });
  const hasFiles = !!files.length;

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
        <SortSelect
          onChange={(value) => setSortType(value as SortOptions)}
          value={sortType}
        />
      </div>
      <div className={styles.gridWrapper}>
        {hasFiles && <ImagesGrid files={files} />}
        {!hasFiles && <NoFiles />}
      </div>
    </div>
  );
};

function useTags() {
  const [selectedTags, setSelectedTags] = useState([]);
  const tags = useSelector(getTags);
  const tagsArray = useSelector(getTagsArray);

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

  return {
    selectedTags,
    tags,
    tagsArray,
    handleSelectTag,
    handleRemoveTag,
  };
}

function useImages({ selectedTags, tags, sortType }) {
  const filesArray = useSelector(getFilesArray);
  const files = useSelector(getFiles);
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
  }, [selectedTags, files, tags]);
  const sortedFiles = useMemo(() => {
    return sortImages(filesArray, sortType);
  }, [filesArray, sortType]);
  return selectedTags.length ? filteredFiles : sortedFiles;
}

function sortImages(files: ImageData[], sortType: string): ImageData[] {
  switch (sortType) {
    case SortOptions.NEW_FIRST:
      return orderBy(files, ["createdAt"], ["desc"]);
    case SortOptions.OLD_FIRST:
      return orderBy(files, ["createdAt"], ["asc"]);
    case SortOptions.POPULAR_FIRST:
      return orderBy(files, ["usedTimes"], ["desc"]);
    case SortOptions.UNPOPULAR_FIRST:
      return orderBy(files, ["usedTimes"], ["asc"]);
    case SortOptions.WITHOUT_TAGS:
      return files.filter((file) => file.tags.length === 0);
    default:
      return files;
  }
}
