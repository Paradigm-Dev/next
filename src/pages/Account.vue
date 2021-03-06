<template>
  <div class="account" v-if="user._id">
    <v-toolbar dense color="deep-purple darken-3">
      <v-toolbar-title>Account</v-toolbar-title>
    </v-toolbar>

    <div
      :style="{
        height: $vuetify.breakpoint.mdAndUp
          ? 'calc(100vh - 112px)'
          : 'calc(100vh - 104px)',
      }"
      style="overflow-y: auto"
    >
      <v-container>
        <div class="text-center mt-12 mb-5">
          <v-avatar
            style="cursor: pointer"
            v-ripple
            @click="uploader = true"
            height="175"
            width="175"
            ><v-img
              loading="lazy"
              :src="`https://www.theparadigm.ga/relay/profile-pics/${$root.user._id}.png`"
            ></v-img></v-avatar
          ><br />
          <h3
            class="text-h3 font-weight-medium mt-8 mb-2"
            :style="{ color: user.color }"
          >
            {{ user.username }}
          </h3>
          <p class="grey--text text--darken-1 font-weight-light mb-12">
            {{ user._id }}
          </p>
        </div>
        <v-row>
          <v-col sm="6">
            <v-card class="fill-height">
              <v-card-text>
                <p>Settings</p>
                <v-text-field
                  hide-details="auto"
                  @input="change = true"
                  v-model="user.bio"
                  label="Bio"
                  :counter="75"
                ></v-text-field>
                <p>Color</p>
                <v-color-picker
                  mode="hexa"
                  hide-mode-switch
                  @input="change = true"
                  v-model="user.color"
                  class="elevation-0"
                  style="width: 100%"
                ></v-color-picker>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col sm="6" v-show="$vuetify.breakpoint.mdAndUp">
            <v-card class="fill-height">
              <v-card-text>
                <p>Pinned Apps</p>

                <div class="d-flex">
                  <draggable
                    :list="user.pinned_apps"
                    @change="change = true"
                    group="apps"
                    style="width: 150px"
                    class="text-center mx-auto"
                    draggable=".item"
                  >
                    <div slot="header">
                      <p>Apps Already Pinned</p>
                    </div>
                    <v-btn
                      v-for="app in user.pinned_apps"
                      :key="app.path"
                      block
                      class="cursor-move item mb-2"
                      :color="app.color"
                      >{{ app.title }}</v-btn
                    >
                  </draggable>
                  <draggable
                    :list="apps_remaining"
                    group="apps"
                    @change="change = true"
                    style="width: 150px"
                    class="text-center mx-auto"
                    draggable=".item"
                  >
                    <div slot="header">
                      <p>Apps Remaining</p>
                    </div>

                    <v-btn
                      v-for="app in apps_remaining"
                      :key="app.path"
                      block
                      class="cursor-move item mb-2"
                      :color="app.color"
                      >{{ app.title }}</v-btn
                    >
                  </draggable>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col sm="6">
            <v-card class="fill-height">
              <v-card-text>
                <p>Rights</p>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">Key</th>
                        <th class="text-left">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Administrator</td>
                        <td>{{ user.rights.admin }}</td>
                      </tr>
                      <tr>
                        <td>Author</td>
                        <td>{{ user.rights.author }}</td>
                      </tr>
                      <tr>
                        <td>Asteroid</td>
                        <td>{{ user.rights.asteroid }}</td>
                      </tr>
                      <tr>
                        <td>Developer</td>
                        <td>{{ user.rights.developer }}</td>
                      </tr>
                      <tr>
                        <td>Apollo</td>
                        <td>{{ user.rights.apollo }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col sm="6">
            <v-card class="fill-height">
              <v-card-text>
                <p class="mb-0">People</p>
              </v-card-text>
              <v-tabs centered grow v-model="people_tab">
                <v-tab>Approved</v-tab>
                <v-tab>Requests</v-tab>
                <v-tab>Sent</v-tab>
                <v-tab>Blocked</v-tab>
              </v-tabs>

              <v-tabs-items
                v-model="people_tab"
                style="max-height: 498px; overflow-y: auto"
              >
                <v-tab-item>
                  <v-list>
                    <draggable
                      :list="user.people.approved"
                      @change="change = true"
                      draggable=".item"
                      handle=".handle"
                    >
                      <v-list-item
                        class="item"
                        v-for="(person, index) in user.people.approved"
                        :key="index"
                      >
                        <div
                          class="d-flex align-center"
                          style="width: 100%"
                          @click="
                            $router.push(
                              `/broadcast/profile/${person.username}`
                            )
                          "
                        >
                          <v-list-item-avatar
                            ><v-img
                              loading="lazy"
                              :src="`https://www.theparadigm.ga/relay/profile-pics/${person._id}.png`"
                            ></v-img
                          ></v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title
                              class="font-weight-medium"
                              :style="{ color: person.color }"
                              >{{ person.username }}</v-list-item-title
                            >
                            <v-list-item-subtitle>{{
                              person._id
                            }}</v-list-item-subtitle>
                          </v-list-item-content>
                        </div>
                        <v-btn
                          icon
                          color="red"
                          @click="removeFriend(person._id)"
                          ><v-icon>mdi-close</v-icon></v-btn
                        >
                        <v-icon class="handle cursor-move grey--text ml-1"
                          >mdi-menu</v-icon
                        >
                      </v-list-item>
                    </draggable>

                    <v-list-item v-if="user.people.approved.length <= 0">
                      <v-list-item-title
                        class="text-center grey--text font-italic"
                        >You have no friends.</v-list-item-title
                      >
                    </v-list-item>
                  </v-list>
                </v-tab-item>

                <v-tab-item>
                  <v-list>
                    <v-list-item v-if="user.people.requests.length <= 0">
                      <v-list-item-title
                        class="text-center grey--text font-italic"
                        >You have no friend requests.</v-list-item-title
                      >
                    </v-list-item>

                    <v-list-item
                      v-for="(person, index) in user.people.requests"
                      :key="index"
                    >
                      <div
                        class="d-flex"
                        style="width: 100%"
                        @click="
                          $router.push(`/broadcast/profile/${person.username}`)
                        "
                      >
                        <v-list-item-avatar
                          ><v-img
                            loading="lazy"
                            :src="`https://www.theparadigm.ga/relay/profile-pics/${person._id}.png`"
                          ></v-img
                        ></v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title
                            class="font-weight-medium"
                            :style="{ color: person.color }"
                            >{{ person.username }}</v-list-item-title
                          >
                          <v-list-item-subtitle>{{
                            person._id
                          }}</v-list-item-subtitle>
                        </v-list-item-content>
                      </div>
                      <v-btn
                        icon
                        color="green"
                        @click="approveRequest(person._id)"
                        ><v-icon>mdi-check</v-icon></v-btn
                      >
                      <v-btn
                        icon
                        color="red"
                        @click="declineRequest(person._id)"
                        ><v-icon>mdi-close</v-icon></v-btn
                      >
                    </v-list-item>
                  </v-list>
                </v-tab-item>

                <v-tab-item>
                  <v-list>
                    <v-list-item v-if="user.people.sent.length <= 0">
                      <v-list-item-title
                        class="text-center grey--text font-italic"
                        >You haven't sent any friend
                        requests.</v-list-item-title
                      >
                    </v-list-item>

                    <v-list-item
                      v-for="(person, index) in user.people.sent"
                      :key="index"
                    >
                      <div
                        class="d-flex"
                        style="width: 100%"
                        @click="
                          $router.push(`/broadcast/profile/${person.username}`)
                        "
                      >
                        <v-list-item-avatar
                          ><v-img
                            loading="lazy"
                            :src="`https://www.theparadigm.ga/relay/profile-pics/${person._id}.png`"
                          ></v-img
                        ></v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title
                            class="font-weight-medium"
                            :style="{ color: person.color }"
                            >{{ person.username }}</v-list-item-title
                          >
                          <v-list-item-subtitle>{{
                            person._id
                          }}</v-list-item-subtitle>
                        </v-list-item-content>
                      </div>
                      <v-btn
                        icon
                        color="blue lighten-1"
                        @click="retractRequest(person._id)"
                        ><v-icon>mdi-undo-variant</v-icon></v-btn
                      >
                    </v-list-item>
                  </v-list>
                </v-tab-item>

                <v-tab-item>
                  <v-list>
                    <v-list-item v-if="user.people.blocked.length <= 0">
                      <v-list-item-title
                        class="text-center grey--text font-italic"
                        >You haven't blocked anybody.</v-list-item-title
                      >
                    </v-list-item>

                    <v-list-item
                      v-for="(person, index) in user.people.blocked"
                      :key="index"
                    >
                      <v-list-item-avatar
                        ><v-img
                          loading="lazy"
                          :src="`https://www.theparadigm.ga/relay/profile-pics/${person._id}.png`"
                        ></v-img
                      ></v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title
                          class="font-weight-medium"
                          :style="{ color: person.color }"
                          >{{ person.username }}</v-list-item-title
                        >
                        <v-list-item-subtitle>{{
                          person._id
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                      <v-btn
                        icon
                        color="green"
                        @click="unblockPerson(person._id)"
                        ><v-icon>mdi-minus</v-icon></v-btn
                      >
                    </v-list-item>
                  </v-list>
                </v-tab-item>
              </v-tabs-items>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col sm="6">
            <v-card class="fill-height">
              <v-card-text class="pa-0">
                <p class="ma-0 pt-4 pb-2 pl-4">Chatrooms</p>
                <v-list style="max-height: 454px; overflow-y: auto">
                  <v-list-item v-if="user.chatrooms.length <= 0">
                    <v-list-item-title
                      class="text-center grey--text font-italic"
                      >You aren't in any chatrooms.</v-list-item-title
                    >
                  </v-list-item>

                  <draggable
                    :list="user.chatrooms"
                    @change="change = true"
                    draggable=".item"
                    handle=".handle"
                  >
                    <v-list-item
                      class="item"
                      v-for="(chatroom, index) in user.chatrooms"
                      :key="index"
                      @click="$router.push(`/wire/chatroom/${chatroom.id}`)"
                    >
                      <v-list-item-icon class="mt-5 ml-3 mr-6"
                        ><v-icon>{{ chatroom.icon }}</v-icon></v-list-item-icon
                      >
                      <v-list-item-content>
                        <v-list-item-title class="font-weight-medium">{{
                          chatroom.name
                        }}</v-list-item-title>
                        <v-list-item-subtitle>{{
                          chatroom.id
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                      <v-btn
                        icon
                        color="red"
                        @click="deleteChatroom(chatroom.id)"
                        ><v-icon>mdi-close</v-icon></v-btn
                      >
                      <v-icon class="handle grey--text cursor-move ml-1"
                        >mdi-menu</v-icon
                      >
                    </v-list-item>
                  </draggable>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col sm="6">
            <v-card class="fill-height">
              <v-card-text>
                <p class="mb-4">Change Password</p>
                <v-text-field
                  hide-details="auto"
                  class="mb-4"
                  style="min-width: 320px"
                  type="password"
                  label="Current Password"
                  v-model="reset.current"
                ></v-text-field>
                <v-text-field
                  hide-details="auto"
                  class="mb-4"
                  type="password"
                  label="New Password"
                  v-model="reset.new"
                ></v-text-field>
                <v-text-field
                  hide-details="auto"
                  @keypress.enter="changePassword()"
                  type="password"
                  label="Verify New Password"
                  v-model="reset.verify"
                ></v-text-field>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  :disabled="
                    !reset.current ||
                    !reset.new ||
                    !reset.verify ||
                    reset.new !== reset.verify
                  "
                  text
                  color="blue accent-1"
                  @click="changePassword()"
                  >Change</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>
          <!-- <v-col sm="6">
            <v-card class="fill-height">
              <v-card-text>
                <v-row class="mt-0">
                  <v-col class="py-0" sm="10">
                    <p>Apollo Program</p>
                  </v-col>
                  <v-col class="py-0" sm="2" v-if="$root.user.rights.developer">
                    <p class="text-right">
                      <span class="font-weight-black">{{
                        $root.user.apollo_codes.created
                      }}</span>
                      / {{ $root.user.apollo_codes.quota }}
                    </p>
                  </v-col>
                </v-row>

                <div class="text-center">
                  <p>
                    You are currently
                    <span
                      class="text-h6 font-weight-medium"
                      :class="{
                        'red--text': !user.rights.apollo,
                        'green--text': user.rights.apollo,
                      }"
                      >{{
                        user.rights.apollo ? "ENROLLED" : "NOT ENROLLED"
                      }}</span
                    >
                    in the Apollo Beta Testing Program.
                  </p>
                  <v-btn
                    disabled
                    class="mb-8"
                    :color="user.rights.apollo ? 'red' : 'green'"
                    @click="
                      user.rights.apollo
                        ? (apollo_unenroll_dialog = true)
                        : (apollo_enroll_dialog = true)
                    "
                    >{{ user.rights.apollo ? "Unenroll" : "Enroll" }}</v-btn
                  >
                </div>
                <v-simple-table v-if="$root.user.rights.developer">
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">Name</th>
                        <th class="text-left">Code</th>
                        <th class="text-left">Profile</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="code in apollo_codes" :key="code.code">
                        <td>{{ code.name }}</td>
                        <td>{{ code.code }}</td>
                        <td
                          v-ripple
                          style="cursor: pointer"
                          @click="
                            $router.push(`/broadcast/profile/${code.username}`)
                          "
                        >
                          {{ code.username }}
                        </td>
                      </tr>
                      <tr
                        v-if="
                          $root.user.apollo_codes.quota -
                            $root.user.apollo_codes.created >
                          0
                        "
                      >
                        <td colspan="3">
                          <input
                            @keypress.enter="createCode()"
                            style="width: 100%"
                            type="text"
                            placeholder="Name"
                            v-model="new_code_name"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>

                <div class="text-center mt-4" v-if="user.rights.developer">
                  <p
                    v-if="
                      $root.user.apollo_codes.quota -
                        $root.user.apollo_codes.created >
                      0
                    "
                    class="mb-0"
                  >
                    Since you are a core team member, you can create
                    {{
                      $root.user.apollo_codes.quota -
                      $root.user.apollo_codes.created
                    }}
                    code{{
                      $root.user.apollo_codes.quota -
                        $root.user.apollo_codes.created ==
                      1
                        ? " for someone"
                        : "s for people"
                    }}
                    to use to join the Apollo Beta Testing Program.
                  </p>
                  <p class="mb-0" v-else>You have 0 codes remaining.</p>
                </div>
              </v-card-text>
            </v-card>
          </v-col> -->
          <v-col sm="6">
            <v-card class="fill-height" style="border: #f44336 2px solid">
              <v-card-text class="text-center">
                <p class="text-left">Danger Zone</p>
                <v-btn
                  style="margin: 95px 0px 95px 0px"
                  color="red"
                  @click="delete_dialog = true"
                  >Delete Account</v-btn
                >
              </v-card-text>
              <v-btn
                fab
                absolute
                top
                right
                x-small
                text
                v-if="$root.user.rights.patriot"
                @click="$router.push('/patriot')"
              ></v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <v-dialog v-model="uploader" max-width="350">
      <v-card>
        <v-card-title class="text-h5 font-weight-medium"
          >PROFILE PICTURE</v-card-title
        >
        <v-card-text>
          <v-file-input
            prepend-icon=""
            id="file"
            ref="file"
            v-model="new_pic"
            multiple
            label="Upload..."
          ></v-file-input>
          <p class="text-center mb-0">
            This will take effect the next time you log in.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text
            color="grey darken-1"
            @click="
              new_pic = undefined;
              uploader = false;
            "
            >Cancel</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn text color="blue accent-1" @click="uploadNewPic()"
            >Upload</v-btn
          >
        </v-card-actions>
        <v-progress-linear
          :active="upload_file_loading"
          :indeterminate="true"
          absolute
          bottom
          color="deep-purple accent-4"
        ></v-progress-linear>
      </v-card>
    </v-dialog>

    <v-dialog v-model="delete_dialog" max-width="350">
      <v-card color="red">
        <v-card-title class="text-h5 font-weight-medium">CONFIRM</v-card-title>
        <v-card-text>
          <v-checkbox
            label="By checking this box, you acknowledge that deleting your account is irreversible. Your drawer files will be deleted. Your data will be deleted."
            color="white"
            v-model="delete_verify"
          ></v-checkbox>
          <p class="text-center mb-0"></p>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="grey darken-1" @click="delete_dialog = false"
            >Cancel</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn
            :disabled="!delete_verify"
            text
            color="white"
            @click="deleteAccount()"
            >Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="apollo_unenroll_dialog" max-width="350">
      <v-card color="red">
        <v-card-title class="text-h5 font-weight-medium">CONFIRM</v-card-title>
        <v-card-text>
          By unerolling your account from the Apollo Beta Testing Program, you
          will lose all exclusive features and rights until you receive another
          invite code. Your personal information that you submitted when you
          started testing will be deleted at midnight, tonight. Thank you for
          testing our upcoming features.
        </v-card-text>
        <v-card-actions>
          <v-btn
            text
            color="grey darken-1"
            @click="apollo_unenroll_dialog = false"
            >Cancel</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn text color="white" @click="apolloUnenroll()">Unenroll</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn
      style="z-index: 1000"
      large
      fab
      fixed
      bottom
      right
      color="blue"
      v-if="change == true"
      @click="saveChanges()"
      ><v-icon>mdi-content-save</v-icon></v-btn
    >
  </div>
</template>

<script>
import draggable from "vuedraggable";

export default {
  name: "Account",
  data() {
    return {
      user: {},
      reset: {},
      change: false,
      new_pic: null,
      uploader: false,
      delete_dialog: false,
      delete_verify: false,
      console,
      people_tab: 0,
      upload_file_loading: false,
      apollo_unenroll_dialog: false,
      apollo_enroll_dialog: false,
      apollo_codes: [],
      new_code_name: "",
      apps_remaining: [],
    };
  },
  components: {
    draggable,
  },
  methods: {
    fixData() {
      this.user = JSON.parse(JSON.stringify(this.$root.user));
      let apps = [];
      for (let app of Object.values(this.$root.config.apps)) {
        if (
          !this.user.pinned_apps.find(
            (pinned_app) => pinned_app.path == app.path
          ) &&
          app.enabled &&
          app.title != "Home" &&
          app.title != "Privacy" &&
          app.title != "Terms" &&
          app.title != "Support"
        )
          apps.push(app);
      }
      this.apps_remaining = [];
      JSON.parse(JSON.stringify(apps)).forEach((app) => {
        if (app.rights) {
          if (this.user.rights[app.rights]) this.apps_remaining.push(app);
        } else this.apps_remaining.push(app);
      });
    },
    changePassword() {
      if (this.reset.new === this.reset.verify) {
        this.$http
          .post("https://www.theparadigm.ga/api/users/signin", {
            username: this.$root.user.username,
            password: this.reset.current,
          })
          .then((response) => {
            if (!response.data.msg) {
              this.$http
                .post("https://www.theparadigm.ga/api/users/reset", {
                  username: this.$root.user.username,
                  password: this.reset.new,
                })
                .then((response) => {
                  this.$root.user = response.data;
                  this.user = response.data;
                });
            } else {
              this.$notify(
                "Your current password is incorrect",
                "error",
                "mdi-lock",
                false,
                3000
              );
            }
          })
          .catch((error) => console.error(JSON.stringify(error)));
      }
    },
    saveChanges() {
      this.$http
        .post("https://www.theparadigm.ga/api/users/update", {
          old: this.$root.user.username,
          bio: this.user.bio,
          color: this.user.color,
          pinned_apps: this.user.pinned_apps,
          chatrooms: this.user.chatrooms,
          friends: this.user.people.approved,
        })
        .then((response) => {
          this.$root.user = response.data;
          this.user = response.data;
          this.change = false;
        })
        .catch((error) => console.error(error));
    },
    uploadNewPic() {
      this.upload_file_loading = true;
      let formData = new FormData();
      for (var i = 0; i < this.new_pic.length; i++) {
        let file = this.new_pic[i];
        formData.append("files[" + i + "]", file);
      }
      this.$http
        .post(
          `https://www.theparadigm.ga/api/users/${this.$root.user._id}/pic`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          this.new_pic = null;
          this.upload_file_loading = false;
          this.uploader = false;
        })
        .catch((error) => {
          console.log("Upload: failed", error);
          this.new_pic = null;
        });
    },
    createCode() {
      this.$http
        .post(`https://www.theparadigm.ga/api/apollo/${this.$root.user._id}`, {
          name: this.new_code_name,
        })
        .then((response) => {
          this.new_code_name = "";
          this.apollo_codes = response.data;
        });
    },
    deleteAccount() {
      this.$http
        .get(
          `https://www.theparadigm.ga/api/users/${this.$root.user._id}/delete`
        )
        .then((response) => {
          this.$root.user = false;
          this.$router.replace("/");
        })
        .catch((error) => console.error(error));
    },
    approveRequest(person) {
      this.$http
        .get(
          `https://www.theparadigm.ga/api/users/${this.$root.user._id}/people/request/${person}/approve`
        )
        .then((response) => {
          this.$root.user.people = response.data;
          this.fixData();
          this.$root.socket.emit("new_chatroom");
        })
        .catch((error) => console.error(error));
    },
    declineRequest(person) {
      this.$http
        .get(
          `https://www.theparadigm.ga/api/users/${this.$root.user._id}/people/request/${person}/decline`
        )
        .then((response) => {
          this.$root.user.people = response.data;
          this.fixData();
        })
        .catch((error) => console.error(error));
    },
    retractRequest(person) {
      this.$http
        .get(
          `https://www.theparadigm.ga/api/users/${this.$root.user._id}/people/request/${person}/retract`
        )
        .then((response) => {
          this.$root.user.people = response.data;
          this.fixData();
        })
        .catch((error) => console.error(error));
    },
    removeFriend(person) {
      this.$http
        .get(
          `https://www.theparadigm.ga/api/users/${this.$root.user._id}/people/remove/${person}`
        )
        .then((response) => {
          this.$root.user.people = response.data;
          this.fixData();
          this.$root.socket.emit("new_chatroom");
        })
        .catch((error) => console.error(error));
    },
    unblockPerson(person) {
      this.$http
        .get(
          `https://www.theparadigm.ga/api/users/${this.$root.user._id}/people/unblock/${person}`
        )
        .then((response) => {
          this.$root.user.people = response.data;
          this.fixData();
        })
        .catch((error) => console.error(error));
    },
    deleteChatroom(chatroom) {
      this.$http
        .get(
          `https://www.theparadigm.ga/api/users/${this.$root.user._id}/chatroom/${chatroom}/leave`
        )
        .then((response) => {
          this.$root.user = response.data;
          this.fixData();
        })
        .catch((error) => console.error(error));
    },
  },
  created() {
    let fixDataLoop = setInterval(() => {
      this.fixData();
      if (this.user._id) clearInterval(fixDataLoop);
    }, 250);
  },
  mounted() {
    if (this.$root.user.rights.developer) {
      this.$http
        .get(
          `https://www.theparadigm.ga/api/apollo/${this.$root.user._id}/list`
        )
        .then((response) => {
          this.apollo_codes = response.data;
        });
    }
  },
};
</script>

<style scoped>
.cusor-move {
  cursor: grab !important;
}
</style>
