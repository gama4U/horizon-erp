export const updateBranchOffice = (branch: string) => {
  localStorage.setItem('branch', branch)
}

export const getBranchOffice = () => {
  return localStorage.getItem('branch')
}
