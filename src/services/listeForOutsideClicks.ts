export default function listenForOutsideClicks(
    listening:any,
    setListening:any,
    menuRef:any,
    setOpenMenu:any,
    listenEvent?: any
  ) {
    return () => {
      if (listening) return
      if (!menuRef.current) return
      setListening(true);
      [`touchstart`,'keypress','keydown','keyup','wheel','click'].forEach((type) => {
        document.addEventListener(type, (evt) => {
          const cur = menuRef.current
          const node = evt.target
          if (!!cur && cur.contains(node)) return
          setOpenMenu(false)
        })
      })
      // if(listenEvent)
      // {
        // document.addEventListener('contextmenu', (evt) => {
        //   console.log(menuRef)
        //   const cur = menuRef.current
        //   const node = evt.target
        //   // console.log(cur, node)
        //   if (!!cur && !cur.contains(node)) 
        //     setOpenMenu(false)
        //   // setOpenMenu(false)
        // })
      // }
    }
  }