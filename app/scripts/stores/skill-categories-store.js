import alt from '../dispatchers/alt';
import SkillCategoriesActions from '../actions/skill-categories-actions';

class SkillCategoriesStore {
  constructor() {
    this.categories = [];
    this.loading = false;
    this.bindAction(SkillCategoriesActions.fetch, this.onFetch);
    this.bindAction(SkillCategoriesActions.fetchSuccess, this.onFetchSuccess);
  }

  onFetch() {
    this.loading = true;
  }

  onFetchSuccess(categories) {
    this.loading = false;
    this.categories = categories;
  }
}

export default alt.createStore(SkillCategoriesStore);