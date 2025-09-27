
import React, { createContext, useState } from "react";

const UserDetailContext = createContext({
userDetails: { token: null, email: null, bookings: [] },
setUserDetails: () => {},
});

export default UserDetailContext;

