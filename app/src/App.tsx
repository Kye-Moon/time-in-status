import React from "react";
import "./App.css";
import './index.css'
import "monday-ui-react-core/dist/main.css";
import {Loader, ThemeProvider} from "monday-ui-react-core";
import {useMondayContext} from "./context/MondayContext";
import ViewLayout from "./components/ViewLayout";
import {HelpCircle} from "lucide-react";

// Usage of mondaySDK example, for more information visit here: https://developer.monday.com/apps/docs/introduction-to-the-sdk/

const App = () => {
    const {isLoaded, context, sessionToken} = useMondayContext();
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
                    <>
                        {
                            context?.user.isViewOnly ? (
                                <ThemeProvider>
                                    <div className={'flex justify-center items-center h-screen'}>
                                        <h1 className={'text-center text-lg font-semibold'}>
                                            This app is not available in view-only mode.
                                        </h1>
                                    </div>
                                </ThemeProvider>
                            ) : (
                                <div className={'flex w-full  h-screen '}>
                                    <ThemeProvider themeConfig={context.themeConfig} systemTheme={context.theme}
                                                   className={'w-full'}>
                                        <>
                                            <div
                                                onClick={() => window.open('https://earthy-stag-da6.notion.site/SyncStack-Status-Report-16b8a07a33e34644b69879ba9f07b9e9?pvs=4', '_blank')}
                                                className={'flex cursor-pointer justify-end underline m-2 text-xs space-x-2'}>
                                                <HelpCircle size={16} className={'mr-1'}/>
                                                Documentation & Support
                                            </div>
                                            <ViewLayout/>
                                        </>
                                    </ThemeProvider>
                                </div>
                            )
                        }
                    </>



                )
            }
        </>
    );
};

export default App;
