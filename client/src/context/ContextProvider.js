import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import reducer from "./reducer";

const initialState = {
  currentUser: null,
  openLogin: false,
  loading: false,
  alert: { open: false, severity: "info", message: "" },
  profile: { open: false, file: null, photoURL: "" },
  images: [],
  details: { title: "", description: "", price: 0 },
  costType: 0,
  steps: [
    { label: "Location", completed: false },
    { label: "Details", completed: false },
    { label: "Images", completed: false },
  ],
  location: { lng: 0, lat: 0 },
  updatedFood: null,
  deletedImages: [],
  addedImages: [],
  foods: [],
  priceFilter: 1000000,
  addressFilter: null,
  filteredFoods: [],
  foodinfo: null,
  users: [],
  section: 0,
};
const Context = createContext(initialState);

export const useValue = () => {
  return useContext(Context);
};

const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const mapRef = useRef();
  const containerRef = useRef();
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      dispatch({ type: "UPDATE_USER", payload: currentUser });
    }
  }, []);

  // useEffect(() => {
  //   if (state.currentUser) {
  //     const food = JSON.parse(localStorage.getItem(state.currentUser._id));
  //     if (food) {
  //       dispatch({ type: "UPDATE_LOCATION", payload: food.location });
  //       dispatch({ type: "UPDATE_DETAILS", payload: food.details });
  //       dispatch({ type: "UPDATE_IMAGES", payload: food.images });
  //       dispatch({ type: "UPDATE_UPDATED_FOOD", payload: food.updatedFood });
  //       dispatch({
  //         type: "UPDATE_DELETED_IMAGES",
  //         payload: food.deletedImages,
  //       });
  //       dispatch({ type: "UPDATE_ADDED_IMAGES", payload: food.addedImages });
  //     }
  //   }
  // }, [state.currentUser]);
  return (
    <Context.Provider value={{ state, dispatch, mapRef, containerRef }}>
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
