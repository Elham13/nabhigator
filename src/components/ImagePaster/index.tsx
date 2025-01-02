import { ClipboardEvent, useEffect, useRef, useState } from "react";
import classes from "./style.module.css";

const ImagePaster = () => {
  const inputRef = useRef<HTMLDivElement | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const handleClose = () => {
    setImage(null);
    if (inputRef.current) inputRef.current.innerText = "";
  };

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        console.log(file);
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImage(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  useEffect(() => {
    if (image && inputRef.current) {
      const imgElement = document.createElement("img");
      imgElement.src = image;
      imgElement.alt = "Pasted Image";

      const container = document.createElement("div");
      container.classList.add(classes.imgContainer);
      const button = document.createElement("div");
      button.classList.add(classes.imgBtn);
      button.addEventListener("click", handleClose);
      container.appendChild(imgElement);
      container.appendChild(button);

      inputRef.current.innerText = "";
      inputRef.current.appendChild(container);
    }
  }, [image]);

  return (
    <div className={classes.container}>
      <div
        ref={inputRef}
        className={classes.editableDiv}
        tabIndex={0}
        onPaste={handlePaste}
      />
    </div>
  );
};

export default ImagePaster;
