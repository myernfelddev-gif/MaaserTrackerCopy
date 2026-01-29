
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Group } from '../../types/group';

interface GroupState {
  groups: Group[];
}

const initialState: GroupState = {
  groups: [],
};

const groupSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    setGroups: (state, action: PayloadAction<Group[]>) => {
      state.groups = action.payload;
    },
    clearGroups: (state) => {
      state.groups = [];
    }
  }
});

export const { setGroups, clearGroups } = groupSlice.actions;
export default groupSlice.reducer;
