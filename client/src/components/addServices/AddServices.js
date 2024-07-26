import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  Step,
  StepButton,
  Stepper,
} from "@mui/material";
import AddLocation from "./addLocation/AddLocation";
import AddDetails from "./addDetails/AddDetails";
import AddImages from "./addImages/AddImages";
import { useValue } from "../../context/ContextProvider";
import { Cancel, Send } from "@mui/icons-material";
import { clearFood, createFood, updateFood } from "../../actions/food";
import { useNavigate } from "react-router-dom";

const AddServices = () => {
  const {
    state: {
      images,
      details,
      steps,
      location,
      currentUser,
      updatedFood,
      deletedImages,
      addedImages,
    },
    dispatch,
  } = useValue();
  const [activeStep, setActiveStep] = useState(0);

  const [showSubmit, setShowSubmit] = useState(false);
  const handleNext = () => {
    if (activeStep < steps.length - 1 && steps[activeStep].completed) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      const stepIndex = findUnfinished();
      setActiveStep(stepIndex);
    }
  };

  const checkDisabled = () => {
    if (activeStep < steps.length - 1) return false;
    const index = findUnfinished();
    if (index !== -1) return false;
    return true;
  };

  const findUnfinished = () => {
    return steps.findIndex((step) => !step.completed);
  };

  useEffect(() => {
    if (location.lng || location.lat) {
      if (!steps[0].completed) setComplete(0, true);
    } else {
      if (steps[0].completed) setComplete(0, false);
    }
  }, [location, steps]);

  useEffect(() => {
    if (
      details.title.length > 4 &&
      details.description.length > 9 &&
      details.price > 0
    ) {
      if (!steps[1].completed) setComplete(1, true);
    } else {
      if (steps[1].completed) setComplete(1, false);
    }
  }, [details, steps]);

  useEffect(() => {
    if (images.length) {
      if (!steps[2].completed) setComplete(2, true);
    } else {
      if (steps[2].completed) setComplete(2, false);
    }
  }, [images, steps]);

  const setComplete = (index, status) => {
    dispatch({
      type: "UPDATE_STEP_COMPLETION",
      payload: { stepIndex: index, completed: status },
    });
  };

  useEffect(() => {
    if (findUnfinished() === -1) {
      if (!showSubmit) setShowSubmit(true);
    } else {
      if (showSubmit) setShowSubmit(false);
    }
  }, [steps, showSubmit, findUnfinished]);

  const handleSubmit = () => {
    const food = {
      lng: location.lng,
      lat: location.lat,
      price: details.price,
      title: details.title,
      description: details.description,
      images,
    };
    if (updatedFood)
      return updateFood(
        food,
        currentUser,
        dispatch,
        updatedFood,
        deletedImages
      );
    createFood(food, currentUser, dispatch);
  };

  const navigate = useNavigate();
  const handleCancel = () => {
    if (updatedFood) {
      navigate("/dashboard/restaurants");
      clearFood(dispatch, currentUser, addedImages, updatedFood);
    } else {
      dispatch({ type: "UPDATE_SECTION", payload: 0 });
      clearFood(dispatch, currentUser, images);
    }
  };

  return (
    <Container sx={{ my: 4 }}>
      <Stepper
        alternativeLabel
        nonLinear
        activeStep={activeStep}
        sx={{ mb: 3 }}
      >
        {steps.map((step, index) => (
          <Step key={step.label} completed={step.completed}>
            <StepButton onClick={() => setActiveStep(index)}>
              {step.label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ pb: 7 }}>
        {
          {
            0: <AddLocation />,
            1: <AddDetails />,
            2: <AddImages />,
          }[activeStep]
        }

        <Stack
          direction="row"
          sx={{ pt: 2, pb: 7, justifyContent: "space-around" }}
        >
          <Button
            color="inherit"
            disabled={!activeStep}
            onClick={() =>
              setActiveStep((prevActiveStep) => prevActiveStep - 1)
            }
          >
            Quay lại
          </Button>
          <Button disabled={checkDisabled()} onClick={handleNext}>
            Tiếp tục
          </Button>
        </Stack>

        <Stack
          sx={{ alignItems: "center", justifyContent: "center", gap: 2 }}
          direction="row"
        >
          {showSubmit && (
            <Button
              variant="contained"
              endIcon={<Send />}
              onClick={handleSubmit}
            >
              {updatedFood ? "Cập nhật" : "Xác nhận"}
            </Button>
          )}
          <Button
            variant="outlined"
            endIcon={<Cancel />}
            onClick={handleCancel}
          >
            Hủy
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default AddServices;
