# Sunbear - WebSocket Chat Application

**Sunbear** is a WebSocket-based chat application built using **Electron** for desktop use. The app allows users to communicate with one another through a simple, real-time chat interface. It can be used locally or hosted on a server for external access.

## HOW TO USE

### Prebuilt Versions

You can use the prebuilt version of Sunbear for **Windows** available. Simply download and run the executable file to start using the application.

### Building it Yourself

If you want to build Sunbear for your own device, follow the instructions below to set it up using **Electron Forge**:

1. **Clone or Download the Repository**:
    - Clone the repository or download the source code.

2. **Install Dependencies**:
    - In your terminal, navigate to the project directory and run the following command to install the required dependencies:
      ```bash
      npm install
      ```

3. **Run the Application**:
    - To start the application, run:
      ```bash
      npm start
      ```

4. **Packaging the Application**:
    - To package the app for your platform, run:
      ```bash
      npm run make
      ```

    This will create an installer for your operating system.

---

## Hosting a Server

To host your own server for the chat application:

1. **Download the Code**:
    - Download the code or clone the repository.

2. **Run the Server**:
    - Navigate to the project directory, and run the following command to start the WebSocket server:
      ```bash
      node server.js
      ```

    Alternatively, if you are on Windows, you can run the provided **BOOT.bat** file to start the server.

### User Registration

- All usernames and profiles are stored locally in the `users.json` file.
- Users can register by sending a request to the following URL format:
    ```
    http://SERVERIP?username=JohnDoe&password=mysecret
    ```
    Replace `SERVERIP` with the IP address of the server you're hosting on, and replace `JohnDoe` and `mysecret` with the desired username and password.

---

## HOW TO USE IT REMOTELY

Sunbear is primarily designed for local use. However, you can use tools like **RadminVPN** to simulate a local network and enable communication between users on different devices.

### Steps to Use Remotely:
1. **Set up RadminVPN**:
    - Download and install **RadminVPN** on both the host and client devices. You can find the download [here](https://www.radmin-vpn.com/).
  
2. **Connect to the Same Network**:
    - After installing, both devices need to connect to the same virtual network via RadminVPN.

3. **Access the Server**:
    - Use the IP address provided by **RadminVPN** to connect to the server.

Once you're connected, users can interact with the chat application just like they would on a local network.
