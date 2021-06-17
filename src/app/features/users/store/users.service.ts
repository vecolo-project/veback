import { Injectable } from '@angular/core';
import { UsersStore } from './users.store';
import { HttpClientWrapper } from '../../../core/utils/httpClientWrapper';
import { Snackbar } from '../../../shared/snackbar/snakbar';
import { User } from '../../../shared/models/user.model';
import { API_RESSOURCE_URI } from '../../../shared/api-ressource-uri/api-ressource-uri';
import { UsersQuery } from './users.query';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(
    private usersStore: UsersStore,
    private http: HttpClientWrapper,
    private snackBar: Snackbar,
    private usersQuery: UsersQuery
  ) {}

  async getUsers(): Promise<void> {
    this.usersStore.setLoading(true);
    try {
      const response = await this.http.get<User[]>(API_RESSOURCE_URI.GET_USERS);
      this.usersStore.set(response);
    } catch (e) {
      this.usersStore.set([]);
      this.snackBar.warnning(
        'Erreur lors de la récupération des utilisateurs : ' + e.error.error
      );
    } finally {
      this.usersStore.setLoading(false);
    }
  }

  getUser(id: number): User {
    console.log(id, this.usersQuery.getEntity(id));
    return this.usersQuery.getEntity(id);
    // TODO GET User From API ? if we have pagination
  }

  async deleteUser(userId: number): Promise<void> {
    this.usersStore.setLoading(true);
    try {
      await this.http.delete<User[]>(API_RESSOURCE_URI.DELETE_USER + userId);
      this.usersStore.remove(userId);
    } catch (e) {
      this.snackBar.warnning(
        "Erreur lors de la suppréssion de l'utilisateur : " + e.error.error
      );
    } finally {
      this.usersStore.setLoading(false);
    }
  }
}