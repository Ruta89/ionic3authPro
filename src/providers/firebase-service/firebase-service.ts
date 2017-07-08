import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "angularfire2/database";
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import 'rxjs/add/operator/map';

@Injectable()
export class FirebaseServiceProvider {
  user: firebase.User;
  authState: Observable<firebase.User>;

  constructor(private afAuth: AngularFireAuth,
    public afd: AngularFireDatabase
  ) {
    console.log('Hello FirebaseServiceProvider Provider');
    this.authState = afAuth.authState;

    this.authState.subscribe(user => {
      this.user = user;
    });
  }

  signUp(email, password, name) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(newUser => {
        this.afd.list('/userProfile').update(newUser.uid, { email: email, name: name });
      });
  }

  loginUser(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  logoutUser() {
    return this.afAuth.auth.signOut();
  }

  resetPassword(email) {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  createNewList(name) {
    return this.afd.list('/partLists').push({ name: name, creator: this.user.email });
  }

  getUserLists() {
    return this.afd.list('/partLists', {
      query: {
        orderByChild: 'creator',
        equalTo: this.user.email
      }
    })
      .map(lists => {
        return lists.map(oneList => {
          oneList.partItems = this.afd.list(`/partLists/${oneList.$key}/items`);
          return oneList;
        });
      });
  }

  removeList(id) {
    return this.afd.list('/partLists').remove(id);
  }

  addListItem(listId, item) {
    return this.afd.list(`/partLists/${listId}/items`).push({ name: item });
  }

  removePartItem(listId, itemId) {
    return this.afd.list(`/partLists/${listId}/items`).remove(itemId);
  }

  shareList(listId, listName, shareWith) {
    return this.afd.list('/invitations').push({ listId: listId, listName: listName, toEmail: shareWith, fromEmail: this.user.email });
  }

  getUserInvitations() {
    return this.afd.list('/invitations', {
      query: {
        orderByChild: 'toEmail',
        equalTo: this.user.email
      }
    });
  }

  acceptInvitation(invitation) {
    this.discardInvitation(invitation.$key);
    let data = {
      [this.user.uid]: true
    }
    return this.afd.object('/partLists/' + invitation.listId).update(data);
  }

  discardInvitation(invitationId) {
    return this.afd.list('/invitations').remove(invitationId);
  }

  getSharedLists() {
    return this.afd.list('/partLists', {
      query: {
        orderByChild: this.user.uid,
        equalTo: true
      }
    })
      .map(lists => {
        return lists.map(oneList => {
          oneList.partItems = this.afd.list(`/partLists/${oneList.$key}/items`);
          return oneList;
        });
      });
  }

  getUserData() {
    return this.afd.object('/userProfile/' + this.user.uid);
  }

  updateUserName(newName) {
    return this.afd.object('/userProfile/' + this.user.uid).update({ name: newName });
  }

}
