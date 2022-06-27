const selectStyles = (dark) => {
  let darkmode
  dark === 'dark' ? darkmode = true : darkmode = false

  return {
    control: (base, state) => ({
      ...base,
      background: darkmode ? "#242424" : "#DBDBDB",
      // match with the menu
      borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
      // Overwrittes the different states of border
      borderColor: darkmode ?
        state.isFocused ? '#D6A269' : '#323232'
        :
        state.isFocused ? '#D6A269' : '#CFCFCF',
      // Removes weird border around container
      boxShadow: state.isFocused ? null : null,
      "&:hover": {
        // Overwrittes the different states of border
        borderColor: state.isFocused ? "#D6A269" : "#D6A269"
      }
    }),
    menu: base => ({
      ...base,
      // override border radius to match the box
      borderRadius: 0,
      // kill the gap
      marginTop: 0,
      color: darkmode ? '#DBDBDB' : '#242424',
    }),
    menuList: base => ({
      ...base,
      // kill the white-space on first and last option
      padding: 0,
      background: "#D6A269",
    }),
    option: (base, state) => ({
      ...base,
      background: darkmode ?
        state.isFocused ? '#D6A269' : '#242424'
        :
        state.isFocused ? '#D6A269' : '#DBDBDB',
      color: state.isFocused && '#DBDBDB',
    }),
    singleValue: (base) => ({
      ...base,
      color: darkmode ? '#DBDBDB' : '#242424',
    })
  }
}

export default selectStyles
