export const baseURL = "https://api.solvaafrica.com/api/v1";
// export const baseURL = "https://solva-backend-prod.onrender.com/api/v1";


export const apis = {
  login: `${baseURL}/users/admin/login`,
  admin: `${baseURL}/users/admin`,
  flag: `${baseURL}/users`,
  cash: `${baseURL}/cashouts`,
  job: `${baseURL}/jobs`,
  grant: `${baseURL}/grants`,
  scholar: `${baseURL}/scholarships`,
  stats: `${baseURL}/stats`,

  past: `${baseURL}/questions`,
  docs: `${baseURL}/documents`,

  project: `${baseURL}/projects`,
  slider: `${baseURL}/slider`,
  notification: `${baseURL}/notification`,
};
