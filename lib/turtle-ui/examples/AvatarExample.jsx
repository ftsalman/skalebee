import { Avatar } from "@turtle-ui/components";

export const AvatarExample = () => {
  return (
    <>
      {/* Avatar Loading  */}

      <Avatar isLoading={true}>sahad</Avatar>

      {/* Avatar Default (children) */}

      <Avatar>MS</Avatar>

      {/* Avathar Default (image) */}

      <Avatar
        imgProps={{
          src: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&dpr=2&q=80",
        }}
      />

      {/* Avathar Default (image fallback) */}

      <Avatar
        imgProps={{
          src: "https://idmages.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&dpr=2&q=80",
          className: "",
        }}
      />

      {/* Avathar Custom (image fallback) */}

      <Avatar
        imgProps={{
          src: "https://idmages.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&dpr=2&q=80",
          fallback: {
            children: "FB",
            className: "",
          },
          className: "",
        }}
      />
    </>
  );
};