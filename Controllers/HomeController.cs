using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using MyPortfolio.Models;

namespace MyPortfolio.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }

    public IActionResult Project(string id)
    {
        var validProjects = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            { "cleanitwithfire", "_CleanItWithFire" },
            { "fellowpirates", "_FellowPirates" },
            { "cultofthejarls", "_CultOfTheJarls" },
            { "aseprite", "_Aseprite" },
            { "nanair", "_NanAir" },
            { "cargame2d", "_CarGame2D" },
            { "cargame3d", "_CarGame3D" },
            { "nestor", "_Nestor" },
            { "kodi", "_Kodi" },
            { "teaching", "_Teaching" },
            { "woodworking", "_Woodworking" },
        };

        if (string.IsNullOrEmpty(id) || !validProjects.TryGetValue(id, out var partialName))
            return RedirectToAction("Index");

        ViewData["PartialName"] = partialName;
        ViewData["IsProjectPage"] = true;
        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
