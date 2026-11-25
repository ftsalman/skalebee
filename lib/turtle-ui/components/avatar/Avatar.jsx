import PropTypes from "prop-types";

// Styles

import { cn } from "../../utils/utils";

// Utils

import "./avatar.css";
import { Avatar as AvatarPrimitives } from "@base-ui/react";
import { UserIcon } from "@phosphor-icons/react";

export const Avatar = ({
  isLoading = false,
  imgProps = undefined,
  children,
  className,
}) => {
  if (isLoading) {
    return (
      <AvatarPrimitives.Root
        className={cn("tui-avatar-root tui-avatar-loading", className)}
      ></AvatarPrimitives.Root>
    );
  }

  if (children) {
    return (
      <AvatarPrimitives.Root className={cn("tui-avatar-root", className)}>
        {children}
      </AvatarPrimitives.Root>
    );
  }

  if (imgProps?.src) {
    return (
      <AvatarPrimitives.Root className={cn("tui-avatar-root", className)}>
        <AvatarPrimitives.Image
          src={imgProps?.src}
          className={cn("tui-avatar-img", imgProps?.className)}
        />
        <AvatarPrimitives.Fallback
          delay={600}
          className={cn("tui-avatar-fallback", imgProps?.fallback?.className)}
        >
          {imgProps?.fallback?.children || <UserIcon size={24} />}
        </AvatarPrimitives.Fallback>
      </AvatarPrimitives.Root>
    );
  }

  return null;
};

Avatar.propTypes = {
  isLoading: PropTypes.bool,
  imgProps: PropTypes.object,
  children: PropTypes.node,
  className: PropTypes.string,
};

// 📚 Example :

// import { Avatar } from "@turtle-ui/components";

// export const AvatarExample = () => {
//   return (
//     <>
//       {/* Avatar Loading  */}

//       <Avatar isLoading={true}>sahad</Avatar>

//       {/* Avatar Default (children) */}

//       <Avatar>MS</Avatar>

//       {/* Avathar Default (image) */}

//       <Avatar
//         imgProps={{
//           src: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&dpr=2&q=80",
//         }}
//       />

//       {/* Avathar Default (image fallback) */}

//       <Avatar
//         imgProps={{
//           src: "https://idmages.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&dpr=2&q=80",
//           className: "",
//         }}
//       />

//       {/* Avathar Custom (image fallback) */}

//       <Avatar
//         imgProps={{
//           src: "https://idmages.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&dpr=2&q=80",
//           fallback: {
//             children: "FB",
//             className: "",
//           },
//           className: "",
//         }}
//       />
//     </>
//   );
// };

