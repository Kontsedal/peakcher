export const fileToLink = (file: File | Blob | ArrayBuffer): string =>
  URL.createObjectURL(file);

export const getImageSizes = (
  url: string
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const wrapper = document.createElement("div");
    wrapper.style.width = "0px";
    wrapper.style.height = "0px";
    wrapper.style.overflow = "auto";
    const elem = document.createElement("img");
    elem.style.visibility = "hidden";
    wrapper.appendChild(elem);
    document.body.appendChild(wrapper);
    elem.onload = () => {
      const sizes = elem.getBoundingClientRect();
      wrapper.remove();
      resolve({
        width: sizes.width,
        height: sizes.height,
      });
    };
    elem.onerror = (err) => {
      console.error("img err", err);
      wrapper.remove();
      reject({ width: 0, height: 0 });
    };
    elem.setAttribute("src", url);
  });
};

export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
};

export const linkToBase64 = async (
  link: string,
  type?: string
): Promise<string> => {
  const blob = await fetch(link).then((res) => res.blob());
  let base64Link = await blobToBase64(blob);
  if (type) {
    base64Link = base64Link.replace(/(?<=^data:)([^;]+)/, type);
  }
  return base64Link;
};
