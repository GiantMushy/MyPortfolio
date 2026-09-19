using System.Text.RegularExpressions;

namespace MyPortfolio.Services;

/// <summary>
/// Enumerates a project's images from wwwroot/images/projects/&lt;slug&gt;/.
/// Files must be named &lt;anything&gt;_&lt;number&gt;.&lt;ext&gt; (e.g. clean_it_with_fire_1.gif);
/// the trailing number alone dictates display order, so reordering a project's
/// images is done by renaming files — no code changes needed.
/// </summary>
public class ProjectImages
{
    private static readonly Regex NumberPattern = new(@"_(\d+)\.[A-Za-z0-9]+$", RegexOptions.Compiled);

    private readonly IWebHostEnvironment _env;

    public ProjectImages(IWebHostEnvironment env) => _env = env;

    /// <summary>All numbered images for a project, ordered, as app-relative (~/) paths.</summary>
    public IReadOnlyList<string> For(string slug)
    {
        var dir = Path.Combine(_env.WebRootPath, "images", "projects", slug);
        if (!Directory.Exists(dir))
            return Array.Empty<string>();

        return Directory.EnumerateFiles(dir)
            .Select(f => (Name: Path.GetFileName(f), Match: NumberPattern.Match(Path.GetFileName(f))))
            .Where(x => x.Match.Success)
            .OrderBy(x => int.Parse(x.Match.Groups[1].Value))
            .ThenBy(x => x.Name, StringComparer.OrdinalIgnoreCase)
            .Select(x => $"~/images/projects/{slug}/{x.Name}")
            .ToList();
    }

    /// <summary>Image #1 for a project (the card thumbnail / headline gif), or null if none.</summary>
    public string? First(string slug) => For(slug).FirstOrDefault();

    /// <summary>
    /// A project's images paired with their still versions: for gifs the still is the
    /// generated first-frame poster (see <see cref="GifPosters"/>); for other images
    /// the still is the image itself.
    /// </summary>
    public IReadOnlyList<ProjectSlide> Slides(string slug)
    {
        return For(slug).Select(src =>
        {
            if (!src.EndsWith(".gif", StringComparison.OrdinalIgnoreCase))
                return new ProjectSlide(src, src);

            var physical = Path.Combine(_env.WebRootPath, src.TrimStart('~', '/').Replace('/', Path.DirectorySeparatorChar));
            var posterPhysical = GifPosters.PosterPathFor(physical);
            if (!File.Exists(posterPhysical))
                return new ProjectSlide(src, src); // no poster (yet) — fall back to the gif itself

            var name = Path.GetFileName(posterPhysical);
            var dir = src[..src.LastIndexOf('/')];
            return new ProjectSlide(src, $"{dir}/posters/{name}");
        }).ToList();
    }
}

/// <param name="Src">The real image (~/ path); gifs animate.</param>
/// <param name="Still">A never-animating version of Src (~/ path): the poster for gifs, Src itself otherwise.</param>
public record ProjectSlide(string Src, string Still);
