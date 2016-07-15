import { parse } from 'acorn'
import MagicString from 'magic-string'

export default function ramda ( options ) {
    if ( !options ) options = {}

    if ( !options.transforms ) options.transforms = {}
    options.transforms.modules = false

    const sourceMap = options.sourceMap !== false

    return {
        name: 'ramda',

        transform(code, id){
            let ast
            let transformedSomething = false

            try {
                ast = parse( code, {
                    ecmaVersion: 6,
                    sourceType: 'module'
                })
            } catch ( err ) {
                err.message += ` in ${id}`
                throw err
            }

            const magicString = new MagicString( code )

            ast.body.forEach( node => {
                if ( sourceMap ) {
                    magicString.addSourcemapLocation( node.start )
                    magicString.addSourcemapLocation( node.end )
                }

                if ( node.type === 'ImportDeclaration' ) {
                    if(node.source.value === 'ramda'){
                        let imports = {}
                        node.specifiers.forEach( specifier => {
                            if(specifier.imported != null) {
                                imports[specifier.imported.name] = specifier.local.name
                            }
                        })

                        if(Object.keys(imports).length == 0){
                            return
                        }

                        const importStatements = Object.keys(imports).map(
                            imported => `import ${imports[imported]} from 'ramda/src/${imported}';`
                        ).join('\n')

                        magicString.overwrite(
                            node.start,
                            node.end,
                            importStatements
                        )
                        transformedSomething = true
                    }
                }
            })

            return transformedSomething
                ? {
                    code: magicString.toString(),
                    map: sourceMap
                        ? magicString.generateMap()
                        : null
                }
                : null
        }
    }
}