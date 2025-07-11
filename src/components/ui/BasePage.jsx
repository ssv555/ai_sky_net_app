import React, { useState } from "react";
import { Box, Typography, IconButton, Paper, Collapse } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PropTypes from "prop-types";

// Styled components
const PageContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
}));

const Footer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.darker,
  color: theme.palette.text.primary,
  borderRadius: 0,
  boxShadow: "none",
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  marginTop: "auto",
}));

const Controls = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.darker,
  color: theme.palette.text.primary,
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: "all 0.3s ease-in-out",
  overflow: "hidden",
}));

const ControlsToggleButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(2),
  color: theme.palette.text.primary,
  padding: theme.spacing(0.5),
}));

const Body = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  background: `linear-gradient(180deg, 
    ${theme.palette.background.default} 0%,
    ${alpha(theme.palette.background.paper, 0.8)} 85%,
    ${theme.palette.background.darker} 100%)`,
  padding: theme.spacing(2),
  color: theme.palette.text.primary,
  minHeight: "60vh",
}));

const TitleContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  position: "relative",
});

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  width: "120px",
  height: "48px",
  borderRadius: "24px",
  "&:hover": {
    backgroundColor: alpha(theme.palette.action.hover, 0.1),
  },
}));

const CenteredTitle = styled(Typography)({
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  width: "100%",
  textAlign: "center",
  pointerEvents: "none",
});

const ButtonText = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  fontSize: "0.9rem",
  fontWeight: 500,
}));

const BasePage = ({
  pageTitle,
  isShowControls = false,
  showBtnBack,
  showBtnClose,
  onBackClick,
  onCloseClick,
  controls,
  children,
}) => {
  const [isControlsCollapsed, setIsControlsCollapsed] = useState(false);

  const toggleControls = () => {
    setIsControlsCollapsed(!isControlsCollapsed);
  };

  return (
    <PageContainer>
      <Body>{children}</Body>

      {isShowControls && (
        <Controls
          sx={{
            padding: isControlsCollapsed
              ? (theme) => theme.spacing(0.5, 1)
              : (theme) => theme.spacing(1),
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mb: isControlsCollapsed ? 0 : 1,
            }}
          >
            <ControlsToggleButton onClick={toggleControls} size="small">
              {isControlsCollapsed ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </ControlsToggleButton>
          </Box>
          <Collapse in={!isControlsCollapsed} timeout="auto" unmountOnExit>
            <Box>{controls}</Box>
          </Collapse>
        </Controls>
      )}

      <Footer elevation={0}>
        <TitleContainer>
          <Box>
            {showBtnBack && (
              <StyledIconButton
                edge="start"
                onClick={onBackClick}
                aria-label="Назад"
              >
                <ArrowBackIcon />
                <ButtonText>Назад</ButtonText>
              </StyledIconButton>
            )}
          </Box>

          <CenteredTitle
            variant="h6"
            component="h1"
            sx={{
              fontWeight: 500,
              fontSize: "1.125rem",
            }}
          >
            {pageTitle}
          </CenteredTitle>

          <Box>
            {showBtnClose && (
              <StyledIconButton
                edge="end"
                onClick={onCloseClick}
                aria-label="Закрыть"
              >
                <CloseIcon />
                <ButtonText>Закрыть</ButtonText>
              </StyledIconButton>
            )}
          </Box>
        </TitleContainer>
      </Footer>
    </PageContainer>
  );
};

BasePage.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  isShowControls: PropTypes.bool,
  showBtnBack: PropTypes.bool,
  showBtnClose: PropTypes.bool,
  onBackClick: PropTypes.func,
  onCloseClick: PropTypes.func,
  controls: PropTypes.node,
  children: PropTypes.node,
};

BasePage.defaultProps = {
  isShowControls: false,
  showBtnBack: false,
  showBtnClose: false,
  onBackClick: undefined,
  onCloseClick: undefined,
  controls: null,
  children: null,
};

export default BasePage;
