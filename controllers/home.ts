import {RouterContext} from 'https://deno.land/x/oak/mod.ts'
import {renderFileToString} from 'https://deno.land/x/dejs@0.9.3/mod.ts'

const home = async (ctx: RouterContext) => {
    try{
        const decoder = new TextDecoder("utf-8")
        // const content = await Deno.readFile('../views/index.ejs')
        // const contentDec = decoder.decode(content)
         
        //ctx.response.headers.set("Content-Type", "text/html")
        const renderedFile = await renderFileToString(`${Deno.cwd()}/views/home.ejs`, { name: 'Danil'})
        ctx.response.body = renderedFile
    } catch(err){
        ctx.response.body = err
    }
}

export {home}