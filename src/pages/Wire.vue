<template>
  <div
    :style="{
      height: $vuetify.breakpoint.mdAndUp
        ? 'calc(100vh - 64px)'
        : 'calc(100vh - 56px)',
    }"
    style="overflow-y: auto"
  >
    <!-- TOOLBAR -->
    <v-toolbar dense color="#0C4A6E">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Wire</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        icon
        :to="`/broadcast/profile/${current_dm_person}`"
        v-if="current && current_dm_person"
        ><v-icon>mdi-account</v-icon></v-btn
      >
      <v-btn
        icon
        @click="leaveChatroom()"
        v-if="current && !current_dm_person && current.owner !== $root.user._id"
        ><v-icon>mdi-arrow-expand-left</v-icon></v-btn
      >
      <v-btn icon @click="deleteChatroom()" v-if="current && !current_dm_person"
        ><v-icon>mdi-delete</v-icon></v-btn
      >
    </v-toolbar>

    <main>
      <!-- DRAWER -->
      <v-navigation-drawer
        style="margin-top: 48px"
        :style="{
          width: drawer ? '256px !important' : '56px !important',
          height: $vuetify.breakpoint.mdAndUp
            ? 'calc(100vh - 112px)'
            : 'calc(100vh - 104px)',
        }"
        class="grey darken-4"
        absolute
        permanent
        :mini-variant="!drawer"
        v-model="drawer"
        key="root_drawer"
      >
        <v-list>
          <v-list-item-group mandatory v-model="current_id">
            <v-list-item
              value="home"
              @click="
                current_id = 'home';
                current = null;
                current_dm_person = false;
                $router.push('/wire');
              "
            >
              <v-list-item-icon><v-icon>mdi-home</v-icon></v-list-item-icon>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item>

            <v-list-item
              :value="current_dm_person ? current_id : 'dm'"
              @click="
                current_id = 'dm';
                current = null;
              "
            >
              <v-list-item-icon
                ><v-icon>mdi-account-lock</v-icon></v-list-item-icon
              >
              <v-list-item-title>Direct Messages</v-list-item-title>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item
              v-for="(chatroom, index) in $root.user.chatrooms"
              :key="index"
              :value="chatroom.id"
              @click="changeChatroom(chatroom, false)"
            >
              <v-list-item-icon
                ><v-icon>{{ chatroom.icon }}</v-icon></v-list-item-icon
              >
              <v-list-item-title>{{ chatroom.name }}</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>

      <!-- HOME -->
      <section
        class="text-center mt-12 px-4"
        key="home"
        :style="{ 'margin-left': drawer ? '256px' : '56px' }"
        v-if="
          current_id == 'home' &&
          ($vuetify.breakpoint.smAndDown ? (drawer ? false : true) : true)
        "
      >
        <h3 class="text-h3 font-weight-light">Welcome to Wire!</h3>
        <p class="mt-3">Wire is a secure and freedom-oriented chatting app.</p>
        <div style="max-width: 150px; margin: auto">
          <v-btn
            color="#0C4A6E"
            x-large
            class="mt-8"
            block
            @click="buy_chatroom.open = true"
          >
            <v-icon left>mdi-plus</v-icon> Create
          </v-btn>
          <v-btn
            color="#0C4A6E"
            x-large
            block
            class="mt-2"
            @click="add_chatroom.open = true"
            ><v-icon left>mdi-forum</v-icon> Join</v-btn
          >
        </div>
      </section>

      <!-- DM -->
      <section
        :style="{ 'margin-left': drawer ? '256px' : '56px' }"
        v-if="current_id == 'dm' || current_dm_person"
        key="dm"
        class="d-flex"
      >
        <v-navigation-drawer
          :style="{
            width: $vuetify.breakpoint.smAndDown
              ? !drawer
                ? '56px !important'
                : '56px !important'
              : !drawer
              ? '256px !important'
              : '56px !important',
            height: $vuetify.breakpoint.mdAndUp
              ? 'calc(100vh - 112px)'
              : 'calc(100vh - 104px)',
          }"
          permanent
          :mini-variant="drawer"
          class="grey darken-4"
        >
          <v-list>
            <v-list-item-group v-model="current_dm_person">
              <v-list-item
                @click="changeChatroom(friend, true)"
                :value="friend.username"
                v-for="(friend, index) in approved_friends"
                :key="index"
              >
                <v-badge
                  style="position: relative; left: -15px"
                  bordered
                  bottom
                  dot
                  :offset-x="!drawer ? 25 : 16"
                  offset-y="17"
                  color="green"
                  :value="friend.in"
                >
                  <v-list-item-avatar
                    :class="{
                      'ma-2': $vuetify.breakpoint.xsOnly
                        ? drawer
                          ? true
                          : true
                        : drawer
                        ? true
                        : false,
                    }"
                    ><v-img
                      loading="lazy"
                      :src="`https://www.theparadigm.ga/relay/profile-pics/${friend._id}.png`"
                    ></v-img
                  ></v-list-item-avatar>
                </v-badge>
                <v-list-item-title
                  class="font-weight-medium"
                  :style="{ color: friend.color }"
                  >{{ friend.username }}</v-list-item-title
                >
              </v-list-item>

              <v-list-item @click="$router.push('/broadcast/find')">
                <v-badge
                  style="position: relative; left: -15px"
                  bordered
                  bottom
                  dot
                  :offset-x="!drawer ? 25 : 16"
                  offset-y="17"
                  color="green"
                  :value="false"
                >
                  <v-list-item-avatar
                    :class="{
                      'ma-2': $vuetify.breakpoint.xsOnly
                        ? drawer
                          ? true
                          : true
                        : drawer
                        ? true
                        : false,
                    }"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-list-item-avatar>
                </v-badge>
                <v-list-item-title>Add</v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-navigation-drawer>

        <!-- CHAT LIST -->
        <div
          v-if="current"
          v-chat-scroll="{
            always: false,
            smooth: true,
            notSmoothOnInit: true,
          }"
          :style="{
            height: $vuetify.breakpoint.mdAndUp
              ? 'calc(100vh - 204px)'
              : 'calc(100vh - 186px)',
            width: drawer ? 'calc(100vw - 312px)' : 'calc(100vw - 112px)',
          }"
          style="overflow: auto; padding: 16px 16px 0px 16px"
        >
          <div class="text-center mt-12" v-if="current.messages.length < 1">
            <v-img
              src="../assets/img/wire.png"
              width="125"
              height="125"
              class="ma-auto mb-5"
            ></v-img>
            <h4 class="text-h4 mb-2">There are no messages here</h4>
            <p class="grey--text">Why don't you start the conversation?</p>
          </div>

          <div
            v-for="(message, index) in current.messages"
            :key="message._id"
            @mouseover="current_message = index"
            @mouseleave="current_message = -1"
            class="d-flex"
            style="position: relative"
          >
            <img
              style="border-radius: 40px"
              class="mt-1"
              height="40"
              width="40"
              :src="`https://www.theparadigm.ga/relay/profile-pics/${message.user_id}.png`"
            />
            <div class="ml-3" style="flex-grow: 1; width: calc(100% - 125px)">
              <p class="mb-0">
                <span
                  class="font-weight-medium"
                  :style="{ color: message.color }"
                >
                  {{ message.username }}
                </span>
                <span class="caption grey--text font-weight-light ml-1">
                  {{ message.timestamp }}
                </span>
                <span
                  class="caption grey--text font-weight-light ml-1"
                  v-if="message.edits != 0 && message.type == 'message'"
                  >•<span class="pl-1">
                    {{ message.edits }}
                    {{ message.edits > 1 ? "edits" : "edit" }}
                  </span>
                </span>
              </p>
              <p v-if="message.type == 'message'" v-html="message.content"></p>
              <v-card
                v-if="message.type == 'file'"
                @click="window.open(message.url)"
                max-width="350"
              >
                <v-card-title>{{ message.content }}</v-card-title>
              </v-card>
              <img
                v-if="message.type == 'image'"
                :src="message.url"
                style="max-width: 40vw"
              />
              <video
                v-if="message.type == 'video'"
                controls
                :src="message.url"
              ></video>
            </div>
            <div
              style="position: absolute; top: 0px; right: 0px"
              v-if="
                current_message == index
                  ? message.user_id == $root.user._id
                    ? true
                    : false
                  : false
              "
            >
              <v-btn
                small
                icon
                color="grey darken-2"
                v-if="message.type == 'message'"
                @click="editChat(message)"
                ><v-icon>mdi-pencil</v-icon></v-btn
              >
              <v-btn
                small
                icon
                color="grey darken-2"
                @click="deleteChat(message)"
                ><v-icon>mdi-delete</v-icon></v-btn
              >
            </div>
          </div>
        </div>
      </section>

      <!-- CHATROOM VIEW -->
      <section
        :style="{ 'margin-left': drawer ? '256px' : '56px' }"
        v-if="current && !current_dm_person"
        key="chatroom"
      >
        <!-- CHAT LIST -->
        <div
          v-if="current"
          v-chat-scroll="{
            always: false,
            smooth: true,
            notSmoothOnInit: true,
          }"
          :style="{
            height: $vuetify.breakpoint.mdAndUp
              ? 'calc(100vh - 204px)'
              : 'calc(100vh - 186px)',
          }"
          style="overflow: auto; padding: 16px 16px 0px 16px"
        >
          <div class="text-center mt-12" v-if="current.messages.length < 1">
            <v-img
              src="../assets/img/wire.png"
              width="125"
              height="125"
              class="ma-auto mb-5"
            ></v-img>
            <h4 class="text-h4 mb-2">There are no messages here</h4>
            <p class="grey--text">Why don't you start the conversation?</p>
          </div>

          <div
            v-for="(message, index) in current.messages"
            :key="message._id"
            @mouseover="current_message = index"
            @mouseleave="current_message = -1"
            class="d-flex"
            style="position: relative"
          >
            <img
              style="border-radius: 40px"
              class="mt-1"
              height="40"
              width="40"
              :src="`https://www.theparadigm.ga/relay/profile-pics/${message.user_id}.png`"
            />
            <div class="ml-3" style="flex-grow: 1; width: calc(100% - 125px)">
              <p class="mb-0">
                <span
                  class="font-weight-medium"
                  :style="{ color: message.color }"
                >
                  {{ message.username }}
                </span>
                <span class="caption grey--text font-weight-light ml-1">
                  {{ message.timestamp }}
                </span>
                <span
                  class="caption grey--text font-weight-light ml-1"
                  v-if="message.edits != 0 && message.type == 'message'"
                  >•<span class="pl-1">
                    {{ message.edits }}
                    {{ message.edits > 1 ? "edits" : "edit" }}
                  </span>
                </span>
              </p>
              <p v-if="message.type == 'message'" v-html="message.content"></p>
              <v-card
                v-if="message.type == 'file'"
                @click="window.open(message.url)"
                max-width="350"
              >
                <v-card-title>{{ message.content }}</v-card-title>
              </v-card>
              <img
                v-if="message.type == 'image'"
                :src="message.url"
                style="max-width: 40vw"
              />
              <video
                v-if="message.type == 'video'"
                controls
                :src="message.url"
              ></video>
            </div>
            <div
              style="position: absolute; top: 0px; right: 0px"
              v-if="
                current_message == index
                  ? message.user_id == $root.user._id
                    ? true
                    : current.owner == $root.user._id
                    ? true
                    : $root.user.rights.admin
                    ? true
                    : false
                  : false
              "
            >
              <v-btn
                small
                icon
                color="grey darken-2"
                v-if="message.type == 'message'"
                @click="editChat(message)"
                ><v-icon>mdi-pencil</v-icon></v-btn
              >
              <v-btn
                small
                icon
                color="grey darken-2"
                @click="deleteChat(message)"
                ><v-icon>mdi-delete</v-icon></v-btn
              >
            </div>
          </div>
        </div>
      </section>

      <!-- NEW CHAT FOOTER -->
      <footer
        :style="{
          'margin-left': $vuetify.breakpoint.smAndDown
            ? current_dm_person || current_id == 'dm'
              ? drawer
                ? '312px'
                : '112px'
              : drawer
              ? '256px'
              : '56px'
            : current_dm_person || current_id == 'dm'
            ? drawer
              ? '312px'
              : '312px'
            : drawer
            ? '256px'
            : '56px',
          width: $vuetify.breakpoint.smAndDown
            ? current_dm_person || current_id == 'dm'
              ? drawer
                ? 'calc(100vw - 312px)'
                : 'calc(100vw - 112px)'
              : drawer
              ? 'calc(100vw - 256px)'
              : 'calc(100vw - 56px)'
            : current_dm_person || current_id == 'dm'
            ? drawer
              ? 'calc(100vw - 312px)'
              : 'calc(100vw - 312px)'
            : drawer
            ? 'calc(100vw - 256px)'
            : 'calc(100vw - 56px)',
        }"
        v-if="
          current &&
          ($vuetify.breakpoint.smAndDown ? (drawer ? false : true) : true)
        "
        key="footer"
      >
        <!-- <v-fade-transition leave-absolute v-if="current_status == 'approved'"> -->
        <v-fade-transition hide-on-leave v-if="typers.length > 0">
          <span class="mb-n2 grey--text font-italic text-body-2"
            ><span
              v-for="(user, index) in typers"
              :key="index"
              :style="{ color: user.color }"
              >{{ user.user }}<span v-if="typers.length - 1 != index">, </span>
            </span>
            is typing...</span
          >
        </v-fade-transition>

        <v-row
          no-gutters
          align="baseline"
          :style="{
            'margin-top': typers.length > 0 ? '0px' : '24px',
          }"
        >
          <v-col cols="10">
            <v-text-field
              style="width: 100%"
              hide-details
              v-model="new_message"
              label="New message..."
              @keyup="startTyping()"
              @keyup.enter="sendMessage()"
            ></v-text-field>
          </v-col>

          <v-col cols="2" class="pl-4">
            <v-btn
              v-if="$vuetify.breakpoint.smAndUp"
              icon
              @click="sendMessage()"
              ><v-icon>mdi-send</v-icon></v-btn
            >
            <v-btn
              icon
              @click="upload.open = true"
              :class="{ 'mb-3': $vuetify.breakpoint.xsOnly }"
              ><v-icon>mdi-paperclip</v-icon></v-btn
            >
          </v-col>
        </v-row>
      </footer>
    </main>

    <!-- EDIT DIALOG -->
    <v-dialog
      v-model="edit.open"
      max-width="350"
      @click:outside="edit = { open: false }"
    >
      <v-card style="text-align: center">
        <v-card-title class="text-h5 font-weight-medium"
          >EDIT CHAT</v-card-title
        >
        <v-card-text>
          <v-text-field
            hide-details="auto"
            @keypress.enter="editChatSave()"
            v-model="edit.content"
            label="Message content"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="red" @click="deleteChat(edit), (edit.open = false)"
            >Delete</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn text color="#0369A1" @click="editChatSave()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- FILE UPLOAD DIALOG -->
    <v-dialog v-model="upload.open" max-width="350">
      <v-card>
        <v-card-title class="text-h5 font-weight-medium"
          >UPLOAD FILE</v-card-title
        >
        <v-card-text
          ><v-file-input
            prepend-icon=""
            id="file"
            ref="file"
            v-model="upload.file"
            multiple
            label="Upload..."
          ></v-file-input
        ></v-card-text>
        <v-card-actions>
          <v-btn @click="upload = { open: false }" color="grey darken-1" text
            >Cancel</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn @click="sendFile()" color="#0369A1" text>Upload</v-btn>
        </v-card-actions>
        <v-progress-linear
          :active="upload.loading"
          :indeterminate="true"
          absolute
          bottom
          color="deep-purple accent-4"
        ></v-progress-linear>
      </v-card>
    </v-dialog>

    <!-- FILE UPLOAD DIALOG -->
    <v-dialog v-model="add_chatroom.open" max-width="350">
      <v-card>
        <v-card-title class="text-h5 font-weight-medium"
          >JOIN CHATROOM</v-card-title
        >
        <v-card-text
          ><v-text-field
            hide-details
            v-model="add_chatroom.code"
            label="Code..."
          ></v-text-field
        ></v-card-text>
        <v-card-actions>
          <v-btn
            @click="add_chatroom = { open: false, code: '' }"
            color="grey darken-1"
            text
            >Cancel</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn @click="joinChatroom()" color="#0369A1" text>Join</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      @click:outside="buy_chatroom = { open: false }"
      v-model="buy_chatroom.open"
      max-width="450"
      style="z-index: 1001"
    >
      <v-card>
        <v-card-title class="text-h5 font-weight-medium"
          >CREATE A CHATROOM</v-card-title
        >

        <v-card-text>
          <v-text-field
            hide-details="auto"
            class="mb-4"
            v-model="buy_chatroom.name"
            label="Chatroom Name"
          ></v-text-field>
          <p>Chatroom Color</p>
          <v-color-picker
            mode="hexa"
            hide-mode-switch
            class="mt-3 mb-3 elevation-0"
            v-model="buy_chatroom.theme"
          ></v-color-picker>
        </v-card-text>

        <v-card-actions>
          <v-btn
            @click="buy_chatroom = { open: false }"
            text
            color="grey darken-1"
            >Cancel</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn @click="buyChatroom()" color="#0369A1" text>Buy</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <audio src="@/assets/audio/sent.wav" id="sent_sound"></audio>
    <audio src="@/assets/audio/msg.wav" id="msg_sound"></audio>
  </div>
</template>

<script>
import { io } from "socket.io-client";
import moment from "moment";

let typingTimeout;
let msg_sound;
let sent_sound;
export default {
  name: "Wire",
  data() {
    return {
      drawer: false,
      current: false,
      current_index: -1,
      current_message: false,
      current_id: "home",
      current_dm_person: false,
      socket: null,
      new_message: "",
      typers: [],
      edit: {
        open: false,
      },
      upload: {
        open: false,
        loading: false,
      },
      buy_chatroom: {
        open: false,
      },
      add_chatroom: {
        open: false,
        code: "",
      },
      all_people: [],
      window,
    };
  },
  computed: {
    approved_friends() {
      var friends = [];
      this.$root.user.people.approved.forEach(async (person) => {
        const index = this.all_people.findIndex((p) => {
          return p._id == person._id;
        });
        person.in = this.all_people[index].in;
        friends.push(person);
      });
      return friends;
    },
  },
  methods: {
    async changeChatroom(to, dm) {
      if (this.socket) {
        this.socket.off("data");
        this.socket.off("send");
        this.socket.off("delete");
        this.socket.off("edit");
        this.socket.off("kill");
        this.socket.off("typing");
        this.socket.off("people");
        this.socket.off("purge");
        await this.socket.disconnect();
      }
      this.current = false;
      this.current_dm_person = false;
      if (dm) {
        this.socket = await io.connect(
          `https://www.theparadigm.ga/wire/${to.dm}`
        );
        this.current_dm_person = to.username;
        if (this.$route.path != `/wire/dm/${to.username}`)
          this.$router.push(`/wire/dm/${to.username}`);
      } else {
        this.socket = await io.connect(
          `https://www.theparadigm.ga/wire/${to.id}`
        );
        if (this.$route.path != `/wire/chatroom/${to.id}`)
          this.$router.push(`/wire/chatroom/${to.id}`);
      }
      this.socket.on("data", (data) => {
        this.current = data;
        this.current_id = dm ? data._id : data.id;
      });
      this.socket.on("send", (data) => {
        if (data.user_id !== this.$root.user._id) msg_sound.play();
        this.current.messages.push(data);
      });
      this.socket.on("delete", async (id) => {
        var index = await this.current.messages.findIndex((message) => {
          return message._id == id;
        });
        await this.current.messages.splice(index, 1);
      });
      this.socket.on("edit", async (data) => {
        var index = await this.current.messages.findIndex((message) => {
          return message._id == data.oldID;
        });
        this.current.messages[index] = data;
      });
      this.socket.on("kill", async () => {
        this.leaveChatroom();
      });
      this.socket.on("typing", (data) => {
        let filteredData = data;
        let exists = false;
        filteredData.forEach((user) => {
          if (user.user == this.$root.user.username) exists = true;
        });
        if (exists) {
          const index = filteredData.findIndex((user) => {
            return this.$root.user.username == user.user;
          });
          filteredData.splice(index, 1);
        }
        this.typers = filteredData;
      });
      this.socket.on("people", (data) => (this.current.people = data));
      this.socket.on("purge", () => (this.current.messages = []));
    },
    async sendMessage() {
      if (this.new_message.length > 0) {
        sent_sound.play();
        clearTimeout(typingTimeout);
        this.socket.emit("typing", {
          user: this.$root.user.username,
          is: false,
          color: this.$root.user.color,
        });
        const data = {
          color: this.$root.user.color,
          username: this.$root.user.username,
          user_id: this.$root.user._id,
          content: this.new_message,
          timestamp: moment().format("MM/DD/YYYY [at] h:mm a"),
          edits: 0,
          type: "message",
        };
        this.socket.emit("send", data);
        this.new_message = "";
      }
    },
    sendFile() {
      this.upload.loading = true;
      let formData = new FormData();
      formData.append("file", this.upload.file[0]);
      this.$http
        .post(
          this.current_dm_person
            ? `https://www.theparadigm.ga/api/wire/dm/${this.current_id}/file`
            : `https://www.theparadigm.ga/api/wire/chatroom/${this.current_id}/file`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          let data = {
            color: this.$root.user.color,
            username: this.$root.user.username,
            user_id: this.$root.user._id,
            timestamp: moment().format("MM/DD/YYYY [at] h:mm a"),
            content: this.upload.file[0].name,
            url: this.current_dm_person
              ? `https://www.theparadigm.ga/relay/wire/dm/${this.current_id}/${this.upload.file[0].name}`
              : `https://www.theparadigm.ga/relay/wire/chatroom/${this.current_id}/${this.upload.file[0].name}`,
            type: "",
          };
          if (this.upload.file[0].type.includes("image")) data.type = "image";
          else if (this.upload.file[0].type.includes("video"))
            data.type = "video";
          else data.type = "file";
          this.socket.emit("send", data);
          this.upload = { open: false };
        })
        .catch((error) => {
          console.log("Upload: failed", error);
          this.upload = { open: false, loading: false };
        });
    },
    startTyping() {
      clearTimeout(typingTimeout);
      this.socket.emit("typing", {
        user: this.$root.user.username,
        is: true,
        color: this.$root.user.color,
      });
      typingTimeout = setTimeout(
        () =>
          this.socket.emit("typing", {
            user: this.$root.user.username,
            is: false,
          }),
        3000
      );
    },
    deleteChat(chat) {
      this.socket.emit("delete", chat._id);
    },
    editChat(chat) {
      this.edit = chat;
      this.edit.open = true;
    },
    editChatSave() {
      this.socket.emit("edit", this.edit);
      this.edit = { open: false };
    },
    joinChatroom() {
      this.$http
        .get(
          `https://www.theparadigm.ga/api/users/${this.$root.user._id}/chatroom/${this.add_chatroom.code}/request`
        )
        .then((response) => {
          if (!response.data.error) {
            this.$root.user = response.data;
            this.add_chatroom = {
              open: false,
              code: "",
            };
          } else
            this.$notify(
              "You cannot join this chatroom",
              "red--text",
              "mdi-cancel",
              3000
            );
        })
        .catch((error) => console.error(error));
    },
    buyChatroom() {
      this.$http
        .post("https://www.theparadigm.ga/api/wire/chatroom/new", {
          icon: "mdi-forum",
          name: this.buy_chatroom.name,
          owner: this.$root.user._id,
          theme: this.buy_chatroom.theme.hex,
        })
        .then((response) => {
          this.$root.socket.emit("new_chatroom");
          this.$root.user.chatrooms.push(response.data);
          this.changeChatroom(response.data.id);
          this.buy_chatroom = {
            open: false,
          };
        })
        .catch((error) => console.error(error));
    },
    leaveChatroom() {
      if (this.$root.user._id != this.current.owner) {
        this.$http
          .get(
            `https://www.theparadigm.ga/api/users/${this.$root.user._id}/chatroom/${this.current.id}/leave`
          )
          .then((response) => {
            this.$root.user = response.data;
            this.socket.emit("send", {
              color: this.$root.user.color,
              username: this.$root.user.username,
              user_id: this.$root.user._id,
              timestamp: moment().format("MM/DD/YYYY [at] h:mm a"),
              type: "left",
            });
            this.socket.disconnect();
            this.current_id = "home";
            this.current = false;
          });
      } else
        this.$notify(
          "You can't leave this chatroom, you own it!",
          "orange--text",
          "mdi-alert",
          3000
        );
    },
    async deleteChatroom() {
      if (
        this.current.owner == this.$root.user._id ||
        this.$root.user.rights.admin == true
      ) {
        this.socket.emit("kill");
        this.leaveChatroom();
        this.$notify("Chatroom deleted", "whit--text", "mdi-delete", 3000);
        this.delete_verify_popup = false;
        await this.$http.get(
          `https://www.theparadigm.ga/api/wire/chatroom/${this.current.id}/delete`
        );
        this.socket.disconnect();
        this.current = false;
        this.current_dm_person = false;
        this.current_id = "home";
      }
    },
    $parseRoute() {
      if (this.$route.path != "/wire") {
        if (this.$route.params.type == "dm") {
          const friend = this.approved_friends.find(
            (person) => person.username == this.$route.params.id
          );
          this.changeChatroom(friend, true);
        } else {
          const chatroom = this.$root.user.chatrooms.find(
            (chatroom) => chatroom.id == this.$route.params.id
          );
          this.changeChatroom(chatroom, false);
        }
      } else {
        this.current = false;
        if (this.socket) this.socket.disconnect();
      }
    },
  },
  async created() {
    if (this.$vuetify.breakpoint.mdAndUp) this.drawer = true;
    this.$http
      .get("https://www.theparadigm.ga/api/users/shortlist")
      .then((response) => {
        this.all_people = response.data;
        this.$parseRoute();
        sent_sound = document.getElementById("sent_sound");
        msg_sound = document.getElementById("msg_sound");
      });
  },
  watch: {
    $route(to, from) {
      this.$parseRoute();
    },
  },
};
</script>

<style scoped>
footer {
  position: absolute;
  bottom: 0px;
  padding: 0px 16px 16px 16px;
}
</style>
