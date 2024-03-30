import React from "react";
import "./App.css";
import './index.css'
import "monday-ui-react-core/dist/main.css";
import {Loader, ThemeProvider} from "monday-ui-react-core";
import {useMondayContext} from "./context/MondayContext";
import ViewLayout from "./components/ViewLayout";
import ReportTypeByFieldSection from "./components/ReportTypeByFieldSection";

// Usage of mondaySDK example, for more information visit here: https://developer.monday.com/apps/docs/introduction-to-the-sdk/

const App = () => {
    const {isLoaded, context} = useMondayContext();
    return (
        <>
            {
                !isLoaded ? (
                    <ThemeProvider>
                        <div className={'flex justify-center items-center h-screen'}>
                            <Loader size={Loader.sizes.LARGE}/>
                        </div>
                    </ThemeProvider>
                ) : (
                    <div className={'flex w-full  h-screen '}>
                        <ThemeProvider themeConfig={context.themeConfig} systemTheme={context.theme}
                                       className={'w-full'}>
                            <ViewLayout/>
                        </ThemeProvider>
                    </div>
                )
            }
        </>
    );
};

export default App;
