import { Typography } from "@mui/material";
import React from "react";

export function Welcome() {
    return (
        <div style={{ width: "100%", height: "100%" }}>
            <Typography sx={{ textAlign: 'center', marginTop: "80px" }} variant="h2">
                Welcome to the new Smiley Editor!
            </Typography>

            <Typography sx={{ textAlign: 'center', marginTop: "200px" }} variant="h5">
                put helpful stuff here
            </Typography>
        </div>
    )
}