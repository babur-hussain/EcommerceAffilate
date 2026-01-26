# Native iOS App

This directory is reserved for the native Swift iOS application: **Local For Vocal**

## Generated Source Code

I have already generated the core Swift implementation for you in the `Sources` directory. It includes:
- **Networking**: Connects to your backend.
- **SDUI Renderer**: Renders the JSON layout from your backend using native SwiftUI.
- **Entry Point**: A ready-to-run SwiftUI App struct.

## Setup Instructions

1.  Open **Xcode**.
2.  Select **Create a new Xcode project**.
3.  Choose **App** (iOS).
4.  **Product Name**: `LocalForVocal`
5.  **Interface**: **SwiftUI** (Critical: Do not select Storyboard)
6.  **Language**: **Swift**
7.  **Save Location**: Save the project inside this `apps/Applications/ios` folder.

## Importing the Code

Once the project is created:
1.  **Delete** the default `LocalForVocalApp.swift` and `ContentView.swift` files created by Xcode.
2.  **Drag and Drop** the `Sources` folder (inside `LocalForVocal`) into your Xcode project navigator.
3.  Ensure **"Copy items if needed"** is unchecked (to link to the files I created) or checked (to copy them).
4.  Build and Run.

## Backend Connection

The `APIService.swift` is configured to look for `http://localhost:4000`.
- If running on **Simulator**, this works out of the box.
- If running on **Physical Device**, replace `localhost` with your Mac's LAN IP address (e.g., `192.168.1.5`).
