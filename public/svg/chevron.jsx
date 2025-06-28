
import SvgIcon from '@mui/material/SvgIcon';

export default function ChevronIcon(props) {
  return (
    <SvgIcon>
      {/* credit: plus icon from https://heroicons.com/ */}
      
      <svg xmlns="http://www.w3.org/2000/svg" width={props.width || "8.412"} height={props.height || "8.412"} viewBox="0 0 8.412 8.412">
        <path id="Path_36" data-name="Path 36" d="M0,0H5.948V5.948L3.355,3.377Z" transform="translate(8.412 4.206) rotate(135)" fill={props.color || "#040404"}/>
      </svg>


    </SvgIcon>
  );
}
