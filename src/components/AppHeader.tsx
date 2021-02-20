/** @jsxRuntime classic */
/** @jsx jsx */
import React from "react";
import { css, jsx } from "@emotion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

interface AppHeaderProps {
  height: number;
}

const AppHeader: React.FC<AppHeaderProps> = (props: AppHeaderProps) => {
  const { height } = props;
  return (
    <header
      css={css`
        height: ${height}px;
        background-color: #444849;
        display: flex;
        align-items: center;
      `}
    >
      <img
        css={css`
          height: 40px;
          margin: 5px 0px 5px 10px;
        `}
        src="SuntecIcon.svg"
        alt="logo"
      />
      <img
        css={css`
          height: 40px;
          margin: 5px;
        `}
        src="SuntecNameWhite.svg"
        alt="logoName"
      />
      <FontAwesomeIcon
        icon={faEllipsisV}
        css={css`
          color: white;
          margin-right: 5px;
        `}
      />{" "}
      <b
        css={css`
          color: #f4982c;
          font-family: Comfortaa;
        `}
      >
        Space Navigator
      </b>
    </header>
  );
};

export default AppHeader;
