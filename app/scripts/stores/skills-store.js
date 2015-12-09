import alt from '../dispatchers/alt'
import SkillsActions from '../actions/skills-actions'

class SkillsStore {
  constructor() {
    this.skills = []
    this.loading = false
    this.bindAction(SkillsActions.fetchByCategory, this.onFetchByCategory)
    this.bindAction(SkillsActions.fetchByCategoryList, this.onFetchByCategoryList)
    this.bindAction(SkillsActions.fetchAllSkills, this.onFetchAllSkils)
    this.bindAction(SkillsActions.fetchByCategorySuccess, this.onFetchByCategorySuccess)
    this.bindAction(SkillsActions.fetchByCategoryListSuccess, this.onFetchByCategoryListSuccess)
    this.bindAction(SkillsActions.fetchAllSkillsSuccess, this.onFetchAllSkilsSuccess)
  }

  onFetchByCategory() {
    this.loading = true
  }

  onFetchByCategoryList() {
    this.loading = true
  }

  onFetchAllSkils() {
    this.loading = true
  }

  onFetchByCategorySuccess(skills) {
    this.loading = false
    this.skills = skills
  }

  onFetchByCategoryListSuccess(skills) {
    this.loading = false
    this.skills = skills
  }

  onFetchAllSkilsSuccess(skills) {
    this.loading = false
    this.skills = skills
  }
}

export default alt.createStore(SkillsStore)