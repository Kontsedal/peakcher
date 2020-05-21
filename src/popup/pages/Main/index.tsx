import React, { useCallback, useMemo, useState } from "react";
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
import { File } from "common/interfaces";
import { I18n } from "../../../common/services/I18n";
import { Button } from "../../components/Button";

export const MainPage = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const tags = useSelector(getTags);
  const tagsArray = useSelector(getTagsArray);
  const filesArray = useSelector(getFilesArray);
  const files = useSelector(getFiles);

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
  const filteredFiles: File[] = useMemo(() => {
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
  const filesToRender = selectedTags.length ? filteredFiles : filesArray;
  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <TagsSelect
          className={styles.tagsSelect}
          options={tagsArray}
          selectedOptions={selectedTags}
          onSelect={handleSelectTag}
          onRemove={handleRemoveTag}
          placeholder={I18n.t("searchBarPlaceholder")}
          optionTextGetter={(tag) => `[${tags[tag].length}] ${tag}`}
        />
        <div className={styles.actions}>
          <Button primary>{I18n.t("addFile")}</Button>
          <Button>{I18n.t("settingsButtonTitle")}</Button>
        </div>
      </div>
      <div className={styles.gridWrapper}>
        <ImagesGrid files={filesToRender} />
      </div>
    </div>
  );
};
