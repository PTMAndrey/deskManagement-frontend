import { useRef } from "react";
import { Image } from "react-konva";
import useImage from "use-image";

const Img = ({ image, isDraggable, onDragEnd, id, onSelect, className, onClick }) => {
  const [img] = useImage(image.src);
  const imgRef = useRef();
  return (<>
    {isDraggable === 'true' ?
      <Image
        image={img}
        x={image.x}
        y={image.y}
        ref={imgRef}
        className={className}
        draggable
        id={id}
        offsetX={img ? img.width / 2 : 0}
        offsetY={img ? img.height / 2 : 0}
        onDragEnd={onDragEnd}
        onClick={onClick}
      />
      :
      <Image
        image={img}
        x={image.x}
        y={image.y}
        ref={imgRef}
        className={className}
        id={id}
        offsetX={img ? img.width / 2 : 0}
        offsetY={img ? img.height / 2 : 0}
        onClick={onClick}
      />
    }
  </>
  );
};

export default Img;
