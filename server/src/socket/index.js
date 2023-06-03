import Users from "../modules/users/users.js";
import Socket from "../modules/socket/socket.js";
import Utils from "../utils/utils.js";

/**
 * Initialize socket routes
 */
const init = () => {
    // On client connection
    Socket.io.on("connection", (socket) => {
        const ipAddress = Utils.ipv6ToIpv4(socket.handshake.address);
        console.log(`Client connected from IP address ${ipAddress}`);

        connection(socket);
        disconnection(socket);
        role(socket);
        action(socket);
        infos(socket);
        layout(socket);
        rename(socket);
    });
};

// Client connection
const connection = (socket) => {
    console.log("[-] New user connected: " + socket.id);
    Users.new(socket.id);
    socket.emit("id", socket.id);
}

// Client disconnection
const disconnection = (socket) => {
    socket.on("disconnect", (data) => {
        console.log("[-] User disconnected: " + socket.id);
        Users.remove(socket.id);

        // Send updated fool list
        Socket.update.fools();
    });
};

/**
 * Client select role
 */
const role = (socket) => {
    socket.on("role", (data) => {
        //console.log(data);

        console.log("[-] User " + socket.id + " selected role " + data.role);
        Users.user(socket.id).setRole(data.role, data.preferences);

        // Send updated fool list
        Socket.update.fools();
    });
};

/**
 * Master send action to fool
 */
const action = (socket) => {
    socket.on("action", (data) => {
        if (!data.target) {
            console.log("[!] No target specified");
            return;
        }

        console.log("[-] Action from " + socket.id + " to " + data.target.id);
        Socket.update.action(data);
    });
};

/**
 * Fool window infos changed
 */
const infos = (socket) => {
    socket.on("infos", (data) => {
        console.log("[-] Infos changed for " + socket.id);
        Users.user(socket.id).infos = {...Users.user(socket.id).infos, ...data};
        // Send updated fool list
        Socket.update.fools();
    });
};

/**
 * Master change fool layout
 */
const layout = (socket) => {
    socket.on("layout", (data) => {
        console.log("[-] Layout changed for " + data.target.id + " by " + socket.id);
        Socket.update.layout(data);

        // Update user desktop
        Users.user(data.target.id).desktop = data.layout.desktop;

        // Send updated fool list
        Socket.update.fools();
    });
};

/**
 * Master rename fool
 */
const rename = (socket) => {
    socket.on("rename", (data) => {
        console.log(data);

        if (!Users.exists(data.target.id)) {
            console.log("[!] User " + data.target.id + " doesn't exist");
            return;
        };

        console.log("[-] Rename " + data.target.name + " (" + data.target.id + ") to " + data.name);
        // Update name
        Users.user(data.target.id).name = data.name;

        Socket.update.name(data);

        // Send updated fool list
        Socket.update.fools();
    });
};

const SocketRoutes = { init };

export default SocketRoutes;
