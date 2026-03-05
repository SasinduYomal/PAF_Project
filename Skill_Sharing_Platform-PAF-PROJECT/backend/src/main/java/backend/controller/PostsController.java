package backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import backend.model.UserModel;
import backend.repository.UserRepository;
import backend.model.Post;
import backend.repository.PostRepository;
import backend.exception.UserNotFoundException;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/posts")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PostsController {

    private final UserRepository userRepository;
    private final PostRepository postRepository;

    // Define an upload directory for posts
    private final String UPLOAD_DIR = "src/main/uploads/posts/";

    @Autowired
    public PostsController(UserRepository userRepository, PostRepository postRepository) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        // Ensure the posts upload directory exists
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }
    }

    /**
     * Upload/share a post.
     *
     * Conditions:
     * - Users can upload up to 3 photos or short videos per post.
     * - Each video should be a short clip (max: 30 sec). (Client-side or additional server-side checks are recommended.)
     * - Users may include a description with their shared content.
     *
     * @param id          The ID of the user sharing the post.
     * @param description (Optional) A description for the post.
     * @param files       Array of files (photos or videos) to upload.
     * @return A ResponseEntity with success or error message.
     */
    @PostMapping("/{id}/upload")
    public ResponseEntity<?> uploadPost(
            @PathVariable Long id,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("files") MultipartFile[] files) {

        // Validate that at least one file is provided and no more than 3 are sent.
        if (files == null || files.length == 0) {
            return ResponseEntity.badRequest().body("Please select at least one file to upload.");
        }
        if (files.length > 3) {
            return ResponseEntity.badRequest().body("You can upload a maximum of 3 files per post.");
        }

        // Check if the user exists
        Optional<UserModel> userOptional = userRepository.findById(id);
        if (!userOptional.isPresent()) {
            throw new UserNotFoundException(id);
        }
        UserModel user = userOptional.get();

        List<String> savedFileNames = new ArrayList<>();

        // Validate file types and save each file to the file system
        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("One of the files is empty. Please try again.");
            }

            String contentType = file.getContentType();
            // Allow only image or video file types
            if (contentType == null || (!contentType.startsWith("image/") && !contentType.startsWith("video/"))) {
                return ResponseEntity.badRequest().body("Invalid file type. Only images and videos are allowed.");
            }

            // Note: Implementing a reliable server-side duration check for videos may require
            // additional libraries (e.g., Xuggler, JCodec) or delegating the check to the client.
            // For now, assume the client enforces the 30-second limit for videos.

            try {
                // Generate a unique file name and save it
                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                String filePath = UPLOAD_DIR + fileName;
                file.transferTo(Paths.get(filePath));
                savedFileNames.add(fileName);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error uploading file: " + file.getOriginalFilename() + " - " + e.getMessage());
            }
        }

        // Create and save a new Post entity to the database.
        Post post = new Post();
        post.setDescription(description);
        post.setMediaFiles(savedFileNames);
        post.setUser(user);

        postRepository.save(post);

        String responseMessage = "Post uploaded successfully.";
        responseMessage += "\nDescription: " + (description != null ? description : "No description provided");
        responseMessage += "\nFiles: " + savedFileNames;

        return ResponseEntity.ok(responseMessage);
    }

    /**
     * Edit an existing post.
     *
     * This endpoint allows updating the post description and optionally replacing the media files.
     * If new media files are provided, the previous media files are removed from both the file system and the database record.
     *
     * @param postId      The ID of the post to edit.
     * @param description (Optional) New description for the post.
     * @param files       (Optional) Array of new files (photos/videos) to replace the current media.
     * @return A ResponseEntity with a success message or error details.
     */
    @PutMapping("/{postId}/edit")
    public ResponseEntity<?> editPost(
            @PathVariable Long postId,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "files", required = false) MultipartFile[] files) {

        // Retrieve the post by ID.
        Optional<Post> postOptional = postRepository.findById(postId);
        if (!postOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Post with ID " + postId + " not found.");
        }
        Post post = postOptional.get();

        // Update the description if provided.
        if (description != null) {
            post.setDescription(description);
        }

        // Handle file replacement if new files are provided.
        if (files != null && files.length > 0) {
            if (files.length > 3) {
                return ResponseEntity.badRequest().body("You can upload a maximum of 3 files per post.");
            }

            // Remove old files from the file system.
            List<String> oldFiles = post.getMediaFiles();
            if (oldFiles != null) {
                for (String oldFileName : oldFiles) {
                    File oldFile = new File(UPLOAD_DIR + oldFileName);
                    if (oldFile.exists()) {
                        oldFile.delete();
                    }
                }
            }

            List<String> newSavedFileNames = new ArrayList<>();

            // Process each new file.
            for (MultipartFile file : files) {
                if (file.isEmpty()) {
                    return ResponseEntity.badRequest().body("One of the files is empty. Please try again.");
                }

                String contentType = file.getContentType();
                if (contentType == null || (!contentType.startsWith("image/") && !contentType.startsWith("video/"))) {
                    return ResponseEntity.badRequest().body("Invalid file type. Only images and videos are allowed.");
                }

                try {
                    // Generate a unique file name and save the file.
                    String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                    String filePath = UPLOAD_DIR + fileName;
                    file.transferTo(Paths.get(filePath));
                    newSavedFileNames.add(fileName);
                } catch (IOException e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("Error uploading file: " + file.getOriginalFilename() + " - " + e.getMessage());
                }
            }

            // Update the post's media files.
            post.setMediaFiles(newSavedFileNames);
        }

        // Save the updated post.
        postRepository.save(post);

        String responseMessage = "Post updated successfully.";
        responseMessage += "\nNew Description: " + (description != null ? description : post.getDescription());
        if (files != null && files.length > 0) {
            responseMessage += "\nNew Files: " + post.getMediaFiles();
        }

        return ResponseEntity.ok(responseMessage);
    }

    /**
     * Endpoint to serve an uploaded post file.
     *
     * @param filename The filename of the uploaded post.
     * @return The file as a resource.
     */
    @GetMapping(value = "/uploads/{filename}")
    @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
    public ResponseEntity<Resource> streamPostFile(@PathVariable String filename,
                                                   @RequestHeader HttpHeaders requestHeaders) throws IOException {

        Path filePath = Paths.get(UPLOAD_DIR).resolve(filename).normalize();
        if (!Files.exists(filePath)) {
            return ResponseEntity.notFound().build();
        }

        // 1. Detect the real content type (falls back to octet‑stream)
        MediaType mediaType = MediaTypeFactory.getMediaType(filename)
                .orElse(MediaType.APPLICATION_OCTET_STREAM);

        // 2. Prepare the resource
        UrlResource video = new UrlResource(filePath.toUri());
        long fileLength = video.contentLength();

        // 3. Handle Range header (if any)
        if (!requestHeaders.getRange().isEmpty()) {
            HttpRange range = requestHeaders.getRange().get(0);
            long start = range.getRangeStart(fileLength);
            long end   = range.getRangeEnd(fileLength);
            long rangeLength = end - start + 1;

// open the stream, advance it, then wrap it
            InputStream input = Files.newInputStream(filePath);
            input.skip(start);
            InputStreamResource slice = new InputStreamResource(input);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(mediaType);
            headers.setContentLength(rangeLength);
            headers.add(HttpHeaders.ACCEPT_RANGES, "bytes");
            headers.add(HttpHeaders.CONTENT_RANGE,
                    String.format("bytes %d-%d/%d", start, end, fileLength));

            return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                    .headers(headers)
                    .body(slice);
        }

        // 4. Full‑file response (when no Range header)
        return ResponseEntity.ok()
                .contentType(mediaType)
                .contentLength(fileLength)
                .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                .body(video);
    }


    /**
     * Retrieve all posts.
     *
     * @return A list of all posts.
     */
    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        List<Post> posts = postRepository.findAll();
        return ResponseEntity.ok(posts);
    }

    /**
     * Retrieve posts made by a specific user.
     *
     * @param id The ID of the user.
     * @return A list of posts made by the given user.
     */
    @GetMapping("/user/{id}")
    public ResponseEntity<?> getPostsByUser(@PathVariable Long id) {
        Optional<UserModel> userOptional = userRepository.findById(id);
        if (!userOptional.isPresent()) {
            throw new UserNotFoundException(id);
        }
        UserModel user = userOptional.get();
        List<Post> posts = postRepository.findByUser(user);
        return ResponseEntity.ok(posts);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable Long postId) {
        Optional<Post> postOptional = postRepository.findById(postId);
        if (!postOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Post with ID " + postId + " not found.");
        }

        Post post = postOptional.get();

        // Delete associated media files from the file system
        List<String> mediaFiles = post.getMediaFiles();
        if (mediaFiles != null) {
            for (String fileName : mediaFiles) {
                File file = new File(UPLOAD_DIR + fileName);
                if (file.exists()) {
                    file.delete();
                }
            }
        }

        // Delete the post from the repository
        postRepository.delete(post);

        return ResponseEntity.ok("Post deleted successfully.");
    }
}

