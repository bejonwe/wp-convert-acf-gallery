import { AppDataSource } from "./data-source"
import { Post } from "./entity/Post";
import { PostMeta } from "./entity/PostMeta"
import * as PHPUnserialize from 'php-unserialize';

AppDataSource.initialize().then(main).catch(error => { console.log(error); AppDataSource.destroy();});

async function main() {
    const galleries = await PostMeta.findBy({meta_key: "featured_gallery"});

    for (const gallery of galleries) {
        await convertGallery(gallery.post_id, gallery.meta_value);
    }

    return await AppDataSource.destroy();
}

async function convertGallery(post_id: number, gallery : string) {
    const picture_ids = await galleryStringToPicIDs(gallery);
    if (picture_ids.length <= 0) {
        console.log(post_id, "No Gallery found.");
        return;
    }

    let post = await Post.findOneBy({ID: post_id, post_type: "post"});
    if (post === null) {
        console.log(post_id, "No Post found.");
        return;
    }

    if (post.post_content.includes("<!-- /wp:gallery -->")) {
        console.log(post_id, "Already contains new Gallery.");
        return;
    }

    let html = `
    <!-- wp:gallery {"linkTo":"file"} -->
    <figure class="wp-block-gallery has-nested-images columns-default is-cropped">`;

    for (const picture_id of picture_ids) {
        let metadata = await PostMeta.findOneBy({post_id: +picture_id, meta_key: "_wp_attachment_metadata"});
        if (metadata === null) {
            console.log(post_id, "NO ATTACHMENT METADATA for " + picture_id + "!");
            return;
        }
        let data = PHPUnserialize.unserialize(metadata.meta_value);

        html += `<!-- wp:image {"id":${picture_id},"sizeSlug":"large","linkDestination":"media"} -->
        <figure class="wp-block-image size-large"><a href="https://news.kisi.org/wp-content/uploads/${data.file}"><img src="https://news.kisi.org/wp-content/uploads/${data.sizes.hasOwnProperty("large") ? data.file.split("/").slice(0,-1).join("/") + "/" + data.sizes.large.file : data.file }" alt="" class="wp-image-${picture_id}"/></a></figure>
        <!-- /wp:image -->`;
    }

    html += `</figure>
    <!-- /wp:gallery -->`;
    
    
    if (!post.post_content.includes("<!-- /wp:paragraph -->")) {
        post.post_content = post.post_content.replace(/\r\n\r\n/g, "\r\n<br/><br/>\r\n");
        post.post_content = `<!-- wp:paragraph -->
        <p>` + post.post_content + `</p>
        <!-- /wp:paragraph -->` + html;
        console.log(post_id, "Inserted surrounding paragraph.");
    } else {
        post.post_content += html;
    }


    post.save();

    console.log(post_id, "Inserted new Gallery.");
}

async function galleryStringToPicIDs (gallery: string) : Promise<Array<string>> {
    return Array.from(gallery.matchAll(/s:[0-9]:"([0-9]*)";/g), x=>x[1]);
}