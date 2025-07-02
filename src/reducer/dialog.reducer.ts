import { createAction, createReducer } from "@reduxjs/toolkit";
// import { clearLocalStorage, getAccessTokenFromLocal } from "../api/auth";
interface DialogState {
  idSelected: any;
  typeDialog: string;
  isOpenDialog: boolean;
}

const initailState: DialogState = {
  idSelected: "",
  typeDialog: "delete",
  isOpenDialog: false,
};

export const setOpenDialog = createAction<boolean>("dialog/setOpenDialog");

export const setIdSelected = createAction<string>("dialog/setIdSelected");

export const setTypeDialog = createAction<string>("dialog/setTypeDialog");

const dialogReducer = createReducer(initailState, (build) => {
  build
    .addCase(setOpenDialog, (state) => {
      state.isOpenDialog = !state.isOpenDialog;
    })
    .addCase(setIdSelected, (state, action) => {
      state.idSelected = action.payload;
    })
    .addCase(setTypeDialog, (state, action) => {
      state.typeDialog = action.payload;
    });
});
export default dialogReducer;
