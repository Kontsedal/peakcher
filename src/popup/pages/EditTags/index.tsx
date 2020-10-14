import React, { useCallback, useContext } from "react";

import { useDispatch, useSelector } from "react-redux";
import { getFiles, getTagsArray } from "common/store/selectors";
import { actions } from "common/store";
import { I18n } from "common/services/I18n";
import { MdKeyboardBackspace } from "react-icons/md";
import styles from "./styles.module.scss";
import { TagsSelect } from "../../components/TagsSelect";
import { Button } from "../../components/Button";
import { CurrentViewContext } from "../../context/currentView";

export const EditTagsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { editImageId, showMainView } = useContext(CurrentViewContext);
  const files = useSelector(getFiles);
  const tagsArray = useSelector(getTagsArray);
  const currentFile = files[editImageId];
  const handleSelect = useCallback(
    (tag) => {
      dispatch(actions.addFileTag({ fileId: editImageId, tag }));
    },
    [dispatch, editImageId]
  );
  const handleRemove = useCallback(
    (tag) => {
      dispatch(actions.removeFileTag({ fileId: editImageId, tag }));
    },
    [dispatch, editImageId]
  );
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
        <img
          alt={currentFile.tags.join(", ")}
          style={{ maxWidth: currentFile.width, maxHeight: currentFile.height }}
          src={currentFile.publicUrl}
          className={styles.image}
        />
      </div>
    </div>
  );
};
