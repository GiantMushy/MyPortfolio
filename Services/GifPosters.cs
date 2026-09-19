using SixLabors.ImageSharp;

namespace MyPortfolio.Services;

/// <summary>
/// Keeps a still "poster" (first frame, saved as PNG) next to every project gif, in a
/// posters/ subfolder: images/projects/&lt;slug&gt;/posters/&lt;gifname&gt;.png.
/// Runs at app startup, so posters exist both for local dev and for the GitHub Pages
/// build (which runs this same app). Posters are generated files — they are gitignored,
/// and stale ones (renamed/removed gifs) are cleaned up automatically.
/// </summary>
public static class GifPosters
{
    public static void Sync(string webRoot)
    {
        var projectsRoot = Path.Combine(webRoot, "images", "projects");
        if (!Directory.Exists(projectsRoot))
            return;

        foreach (var projectDir in Directory.EnumerateDirectories(projectsRoot))
        {
            var posterDir = Path.Combine(projectDir, "posters");
            var gifs = Directory.EnumerateFiles(projectDir, "*.gif").ToList();

            foreach (var gif in gifs)
            {
                var poster = PosterPathFor(gif);
                try
                {
                    if (File.Exists(poster))
                        continue;

                    Directory.CreateDirectory(posterDir);
                    using var image = Image.Load(gif);
                    using var firstFrame = image.Frames.CloneFrame(0);
                    firstFrame.SaveAsPng(poster);
                    Console.WriteLine($"[GifPosters] Generated {Path.GetFileName(poster)} for {Path.GetFileName(gif)}");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[GifPosters] Failed to generate poster for {gif}: {ex.Message}");
                }
            }

            // Remove posters whose gif no longer exists (e.g. after a rename).
            if (Directory.Exists(posterDir))
            {
                var validPosters = gifs.Select(PosterPathFor).ToHashSet(StringComparer.OrdinalIgnoreCase);
                foreach (var orphan in Directory.EnumerateFiles(posterDir).Where(p => !validPosters.Contains(p)))
                {
                    try { File.Delete(orphan); } catch { /* best effort */ }
                }
            }
        }
    }

    // The gif's byte size is baked into the poster name, so renaming or replacing a gif
    // never reuses a stale poster: the old one becomes an orphan (removed by Sync's cleanup)
    // and a fresh one is generated. Size collisions between different gifs are not a realistic risk.
    public static string PosterPathFor(string gifPath)
    {
        var dir = Path.GetDirectoryName(gifPath)!;
        var size = new FileInfo(gifPath).Length;
        return Path.Combine(dir, "posters", $"{Path.GetFileNameWithoutExtension(gifPath)}.{size}.png");
    }
}
