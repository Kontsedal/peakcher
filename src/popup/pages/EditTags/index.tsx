import React, { useCallback } from "react";
import { useContext } from "react";
import { CurrentViewContext } from "../../context/CurrentView";
import { useDispatch, useSelector } from "react-redux";
import { getFiles, getTags, getTagsArray } from "common/store/selectors";
import styles from "./styles.module.scss";
import { TagsSelect } from "../../components/TagsSelect";
import { actions } from "common/store";
import { Button } from "../../components/Button";
import { I18n } from "common/services/I18n";
import { MdKeyboardBackspace } from "react-icons/md";

export const EditTagsPage = () => {
  const dispatch = useDispatch();
  const { editImageId, showMainView } = useContext(CurrentViewContext);
  const files = useSelector(getFiles);
  const tagsArray = useSelector(getTagsArray);
  const currentFile = files[editImageId];
  const handleSelect = useCallback((tag) => {
    dispatch(actions.addFileTag({ fileId: editImageId, tag }));
  }, []);
  const handleRemove = useCallback((tag) => {
    dispatch(actions.removeFileTag({ fileId: editImageId, tag }));
  }, []);
  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <Button flat className={styles.backButton} onClick={showMainView}>
          <MdKeyboardBackspace />
          {I18n.t("exitImageEditText")}
        </Button>
        <TagsSelect
          allowCreate
          options={tagsArray}
          selectedOptions={currentFile.tags}
          onSelect={handleSelect}
          onRemove={handleRemove}
          placeholder={I18n.t("imageTagsInputPlaceholder")}
        />
      </div>
      <div className={styles.imageWrapper}>
        <img src={currentFile.publicUrl} className={styles.image} />
      </div>
    </div>
  );
};
